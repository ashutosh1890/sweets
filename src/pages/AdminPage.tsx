import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/context/AuthContext';
import { useSweets } from '@/context/SweetContext';
import { useToast } from '@/hooks/use-toast';
import { SWEET_CATEGORIES, Sweet } from '@/types/sweet';
import { Plus, Pencil, Trash2, Package, ShieldCheck, Loader2 } from 'lucide-react';
import { z } from 'zod';

const sweetSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name too long'),
  category: z.string().min(1, 'Category is required'),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  quantity: z.number().min(0, 'Quantity cannot be negative').int('Quantity must be a whole number'),
  description: z.string().max(500, 'Description too long').optional(),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
});

export default function AdminPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { sweets, isLoading: sweetsLoading, addSweet, updateSweet, deleteSweet, restockSweet } = useSweets();
  const { toast } = useToast();

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingSweet, setEditingSweet] = useState<Sweet | null>(null);
  const [restockId, setRestockId] = useState<string | null>(null);
  const [restockAmount, setRestockAmount] = useState(10);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    quantity: '',
    description: '',
    image_url: '',
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Show loading while checking auth
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Redirect non-admin users
  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  const resetForm = () => {
    setFormData({ name: '', category: '', price: '', quantity: '', description: '', image_url: '' });
    setFormErrors({});
  };

  const handleOpenAdd = () => {
    resetForm();
    setEditingSweet(null);
    setIsAddDialogOpen(true);
  };

  const handleOpenEdit = (sweet: Sweet) => {
    setFormData({
      name: sweet.name,
      category: sweet.category,
      price: sweet.price.toString(),
      quantity: sweet.quantity.toString(),
      description: sweet.description || '',
      image_url: sweet.image_url || '',
    });
    setFormErrors({});
    setEditingSweet(sweet);
    setIsAddDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const parsedData = {
      name: formData.name.trim(),
      category: formData.category,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity, 10),
      description: formData.description.trim() || undefined,
      image_url: formData.image_url.trim() || undefined,
    };

    const result = sweetSchema.safeParse(parsedData);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        errors[err.path[0] as string] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setIsSubmitting(true);

    let success: boolean;
    if (editingSweet) {
      success = await updateSweet(editingSweet.id, parsedData);
      if (success) {
        toast({
          title: "Sweet updated!",
          description: `${parsedData.name} has been updated successfully.`,
        });
      }
    } else {
      success = await addSweet(parsedData);
      if (success) {
        toast({
          title: "Sweet added!",
          description: `${parsedData.name} has been added to the inventory.`,
        });
      }
    }

    if (!success) {
      toast({
        title: "Error",
        description: "Failed to save changes. Please try again.",
        variant: "destructive",
      });
    }

    setIsSubmitting(false);
    setIsAddDialogOpen(false);
    resetForm();
  };

  const handleDelete = async (sweet: Sweet) => {
    const success = await deleteSweet(sweet.id);
    if (success) {
      toast({
        title: "Sweet deleted",
        description: `${sweet.name} has been removed from the inventory.`,
      });
    } else {
      toast({
        title: "Error",
        description: "Failed to delete sweet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleRestock = async () => {
    if (restockId && restockAmount > 0) {
      const success = await restockSweet(restockId, restockAmount);
      if (success) {
        toast({
          title: "Stock updated!",
          description: `Added ${restockAmount} units to inventory.`,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to update stock. Please try again.",
          variant: "destructive",
        });
      }
      setRestockId(null);
      setRestockAmount(10);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 py-8">
        <div className="container">
          {/* Page Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-candy-mint-light flex items-center justify-center">
                <ShieldCheck className="h-6 w-6 text-candy-mint" />
              </div>
              <div>
                <h1 className="font-display text-2xl md:text-3xl font-bold">
                  Admin Dashboard
                </h1>
                <p className="text-muted-foreground">Manage your sweet inventory</p>
              </div>
            </div>
            
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={handleOpenAdd} variant="candy">
                  <Plus className="h-4 w-4" />
                  Add Sweet
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>
                    {editingSweet ? 'Edit Sweet' : 'Add New Sweet'}
                  </DialogTitle>
                  <DialogDescription>
                    {editingSweet ? 'Update the sweet details below.' : 'Fill in the details for the new sweet.'}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={formErrors.name ? 'border-destructive' : ''}
                    />
                    {formErrors.name && <p className="text-sm text-destructive">{formErrors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger className={formErrors.category ? 'border-destructive' : ''}>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {SWEET_CATEGORIES.map((cat) => (
                          <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {formErrors.category && <p className="text-sm text-destructive">{formErrors.category}</p>}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="price">Price ($)</Label>
                      <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className={formErrors.price ? 'border-destructive' : ''}
                      />
                      {formErrors.price && <p className="text-sm text-destructive">{formErrors.price}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        value={formData.quantity}
                        onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                        className={formErrors.quantity ? 'border-destructive' : ''}
                      />
                      {formErrors.quantity && <p className="text-sm text-destructive">{formErrors.quantity}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description (optional)</Label>
                    <Input
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="image_url">Image URL (optional)</Label>
                    <Input
                      id="image_url"
                      value={formData.image_url}
                      onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                      className={formErrors.image_url ? 'border-destructive' : ''}
                    />
                    {formErrors.image_url && <p className="text-sm text-destructive">{formErrors.image_url}</p>}
                  </div>

                  <DialogFooter>
                    <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        `${editingSweet ? 'Update' : 'Add'} Sweet`
                      )}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display">{sweets.length}</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display">
                  {sweets.reduce((sum, s) => sum + s.quantity, 0)}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Out of Stock
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold font-display text-destructive">
                  {sweets.filter(s => s.quantity === 0).length}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inventory Table */}
          <Card>
            <CardHeader>
              <CardTitle>Inventory</CardTitle>
            </CardHeader>
            <CardContent>
              {sweetsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Price</TableHead>
                        <TableHead className="text-right">Stock</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sweets.map((sweet) => (
                        <TableRow key={sweet.id}>
                          <TableCell className="font-medium">{sweet.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{sweet.category}</Badge>
                          </TableCell>
                          <TableCell className="text-right">${sweet.price.toFixed(2)}</TableCell>
                          <TableCell className="text-right">
                            <Badge 
                              variant={sweet.quantity === 0 ? "destructive" : sweet.quantity <= 10 ? "secondary" : "default"}
                            >
                              {sweet.quantity}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Dialog open={restockId === sweet.id} onOpenChange={(open) => !open && setRestockId(null)}>
                                <DialogTrigger asChild>
                                  <Button 
                                    variant="ghost" 
                                    size="icon"
                                    onClick={() => setRestockId(sweet.id)}
                                  >
                                    <Package className="h-4 w-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-xs">
                                  <DialogHeader>
                                    <DialogTitle>Restock {sweet.name}</DialogTitle>
                                  </DialogHeader>
                                  <div className="py-4">
                                    <Label htmlFor="restock-amount">Quantity to add</Label>
                                    <Input
                                      id="restock-amount"
                                      type="number"
                                      min={1}
                                      value={restockAmount}
                                      onChange={(e) => setRestockAmount(parseInt(e.target.value, 10) || 0)}
                                      className="mt-2"
                                    />
                                  </div>
                                  <DialogFooter>
                                    <Button onClick={handleRestock} variant="mint">
                                      Add Stock
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleOpenEdit(sweet)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon"
                                onClick={() => handleDelete(sweet)}
                                className="text-destructive hover:text-destructive"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}

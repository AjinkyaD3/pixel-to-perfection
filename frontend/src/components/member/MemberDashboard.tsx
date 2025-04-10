import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, Plus, Trash2, Edit } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface GalleryImage {
  id: number;
  url: string;
  title: string;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Expense {
  id: number;
  amount: number;
  description: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
  billUrl: string;
}

export default function MemberDashboard() {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  const [isExpenseDialogOpen, setIsExpenseDialogOpen] = useState(false);

  const sampleImages: GalleryImage[] = [
    {
      id: 1,
      url: "/gallery1.jpg",
      title: "Team Meeting",
      description: "Our weekly team meeting",
      date: "2024-03-15",
      status: "approved"
    },
    // Add more sample images
  ];

  const sampleExpenses: Expense[] = [
    {
      id: 1,
      amount: 150.00,
      description: "Conference registration fee",
      date: "2024-03-15",
      status: "pending",
      billUrl: "/bill1.pdf"
    },
    // Add more sample expenses
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8">Member Dashboard</h1>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="gallery">My Gallery</TabsTrigger>
          <TabsTrigger value="expenses">My Expenses</TabsTrigger>
        </TabsList>

        <TabsContent value="gallery" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Gallery</h2>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleImages.map((image) => (
              <div key={image.id} className="relative group">
                <div className="aspect-square overflow-hidden rounded-lg">
                  <img
                    src={image.url}
                    alt={image.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <h3 className="text-white font-bold">{image.title}</h3>
                      <p className="text-white/80 text-sm">{image.description}</p>
                      <span className={`mt-2 inline-block px-2 py-1 rounded-full text-xs ${
                        image.status === 'approved' ? 'bg-green-100 text-green-800' :
                        image.status === 'rejected' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {image.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expenses" className="mt-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold">My Expenses</h2>
            <Button onClick={() => setIsExpenseDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Amount</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sampleExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell>${expense.amount.toFixed(2)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{new Date(expense.date).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      expense.status === 'approved' ? 'bg-green-100 text-green-800' :
                      expense.status === 'rejected' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {expense.status}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TabsContent>
      </Tabs>

      {/* Upload Image Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload New Image</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Title</label>
              <Input placeholder="Enter image title" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter image description" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Image</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your image here, or click to select
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Expense Dialog */}
      <Dialog open={isExpenseDialogOpen} onOpenChange={setIsExpenseDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Expense</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Amount</label>
              <Input type="number" placeholder="Enter amount" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <Textarea placeholder="Enter expense description" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Bill</label>
              <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Drag and drop your bill here, or click to select
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
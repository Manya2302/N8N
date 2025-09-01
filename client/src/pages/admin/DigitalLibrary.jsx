import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Upload, Plus, Search, Download, Users } from 'lucide-react';

export default function DigitalLibrary() {
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Fetch library data from API
  const { data: libraryStats, isLoading: statsLoading } = useQuery({
    queryKey: ['/api/library/stats'],
  });

  const { data: books, isLoading: booksLoading } = useQuery({
    queryKey: ['/api/library/books'],
  });

  const isLoading = statsLoading || booksLoading;

  if (isLoading) {
    return <div>Loading library data...</div>;
  }

  // Transform API data for the UI
  const bookCategories = books?.reduce((categories, book) => {
    const existing = categories.find(cat => cat.name === book.category);
    if (existing) {
      existing.count++;
    } else {
      categories.push({
        name: book.category,
        count: 1,
        color: `bg-${['blue', 'green', 'purple', 'orange', 'red'][categories.length % 5]}-500`
      });
    }
    return categories;
  }, []) || [];

  const recentActivity = [
    { student: "John Smith", book: "Mathematics Grade 10", action: "borrowed", date: "Today" },
    { student: "Emma Wilson", book: "Physics Concepts", action: "returned", date: "Yesterday" },
    { student: "Mike Johnson", book: "Chemistry Lab Manual", action: "borrowed", date: "2 days ago" },
    { student: "Sarah Davis", book: "World History", action: "reserved", date: "3 days ago" }
  ];

  const popularBooks = books?.map(book => ({
    title: book.title,
    author: book.author,
    borrowed: book.totalCopies - book.availableCopies,
    rating: (Math.random() * 1 + 4).toFixed(1) // Mock rating between 4.0-5.0
  }))?.slice(0, 4) || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BookOpen className="w-8 h-8" />
            Digital Library Management
          </h1>
          <p className="text-muted-foreground">Manage books, resources, and digital content</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" data-testid="button-import-books">
            <Upload className="w-4 h-4 mr-2" />
            Import Books
          </Button>
          <Button data-testid="button-add-book">
            <Plus className="w-4 h-4 mr-2" />
            Add New Book
          </Button>
        </div>
      </div>

      {/* Library Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <Card data-testid="card-total-books">
          <CardHeader>
            <CardTitle className="text-lg">Total Books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{libraryStats?.totalBooks || 0}</div>
            <p className="text-sm text-muted-foreground">Physical & Digital</p>
          </CardContent>
        </Card>

        <Card data-testid="card-borrowed-books">
          <CardHeader>
            <CardTitle className="text-lg">Currently Borrowed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{libraryStats?.borrowed || 0}</div>
            <p className="text-sm text-muted-foreground">Active loans</p>
          </CardContent>
        </Card>

        <Card data-testid="card-ebooks">
          <CardHeader>
            <CardTitle className="text-lg">E-books</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{libraryStats?.ebooks || 0}</div>
            <p className="text-sm text-muted-foreground">Digital copies</p>
          </CardContent>
        </Card>

        <Card data-testid="card-audiobooks">
          <CardHeader>
            <CardTitle className="text-lg">Audiobooks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{libraryStats?.audiobooks || 0}</div>
            <p className="text-sm text-muted-foreground">Audio format</p>
          </CardContent>
        </Card>

        <Card data-testid="card-categories">
          <CardHeader>
            <CardTitle className="text-lg">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-600">{libraryStats?.categories || 0}</div>
            <p className="text-sm text-muted-foreground">Subject areas</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Book Categories */}
        <Card data-testid="card-book-categories">
          <CardHeader>
            <CardTitle>Book Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {bookCategories.map((category, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg" data-testid={`category-${index}`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${category.color}`}></div>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{category.count} books</span>
                    <Button variant="outline" size="sm" data-testid={`button-manage-${index}`}>
                      Manage
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Button variant="outline" className="w-full" data-testid="button-manage-categories">
                <BookOpen className="w-4 h-4 mr-2" />
                Manage All Categories
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent Borrowing Activity */}
        <Card data-testid="card-borrowing-activity">
          <CardHeader>
            <CardTitle>Recent Library Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg" data-testid={`activity-${index}`}>
                  <div>
                    <p className="font-medium text-sm">{activity.student}</p>
                    <p className="text-sm text-muted-foreground">{activity.book}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={
                      activity.action === 'borrowed' ? 'default' :
                      activity.action === 'returned' ? 'secondary' : 'outline'
                    }>
                      {activity.action}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Popular Books */}
      <Card data-testid="card-popular-books">
        <CardHeader>
          <CardTitle>Most Popular Books</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {popularBooks.map((book, index) => (
              <div key={index} className="border rounded-lg p-4" data-testid={`popular-book-${index}`}>
                <div className="space-y-2">
                  <h4 className="font-medium">{book.title}</h4>
                  <p className="text-sm text-muted-foreground">by {book.author}</p>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{book.borrowed}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm">★ {book.rating}</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full" data-testid={`button-view-book-${index}`}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Library Management Actions */}
      <Card data-testid="card-library-actions">
        <CardHeader>
          <CardTitle>Library Management Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-search-books">
              <Search className="w-6 h-6" />
              <span className="text-sm">Search Books</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-generate-report">
              <Download className="w-6 h-6" />
              <span className="text-sm">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-manage-loans">
              <BookOpen className="w-6 h-6" />
              <span className="text-sm">Manage Loans</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2" data-testid="button-inventory-check">
              <Plus className="w-6 h-6" />
              <span className="text-sm">Inventory Check</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
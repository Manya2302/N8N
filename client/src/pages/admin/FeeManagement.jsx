import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DollarSign, Download, CreditCard, Megaphone, Settings2, TrendingUp } from 'lucide-react';

export default function FeeManagement() {
  // Fetch fee data from API
  const { data: feeOverview, isLoading: overviewLoading } = useQuery({
    queryKey: ['/api/fees/overview'],
  });

  const { data: studentFees, isLoading: studentFeesLoading } = useQuery({
    queryKey: ['/api/fees/students'],
  });

  const isLoading = overviewLoading || studentFeesLoading;

  if (isLoading) {
    return <div>Loading fee data...</div>;
  }

  // Transform API data for the UI
  const financialOverview = feeOverview?.categories?.map(cat => ({
    category: cat.name,
    amount: `₹${cat.amount.toLocaleString()}`,
    percentage: Math.floor(Math.random() * 20 + 80), // Mock percentage
    status: Math.random() > 0.5 ? "collected" : "pending"
  })) || [];

  const feeCollection = studentFees || [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <DollarSign className="w-8 h-8" />
            Fee Management
          </h1>
          <p className="text-muted-foreground">Track and manage student fee payments</p>
        </div>
        <Button data-testid="button-export-fees">
          <Download className="w-4 h-4 mr-2" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Fee Collection Overview */}
        <Card data-testid="card-financial-overview">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Fee Collection Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {financialOverview.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`finance-item-${index}`}>
                  <div>
                    <p className="font-medium">{item.category}</p>
                    <p className="text-sm text-muted-foreground">{item.percentage}% collection rate</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{item.amount}</p>
                    <Badge variant={item.status === 'collected' ? 'default' : 'outline'}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Fee Management Actions */}
        <Card data-testid="card-fee-management">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Fee Management Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Button className="w-full" data-testid="button-generate-receipts">
                <Download className="w-4 h-4 mr-2" />
                Generate Receipts
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-payment-reminders">
                <Megaphone className="w-4 h-4 mr-2" />
                Send Payment Reminders
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-fee-structure">
                <Settings2 className="w-4 h-4 mr-2" />
                Manage Fee Structure
              </Button>
              <Button variant="outline" className="w-full" data-testid="button-monthly-report">
                <TrendingUp className="w-4 h-4 mr-2" />
                Monthly Financial Report
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fee Status Table */}
      <Card data-testid="card-fee-status">
        <CardHeader>
          <CardTitle>Student Fee Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {feeCollection.map((fee, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg" data-testid={`fee-status-${index}`}>
                <div>
                  <p className="font-medium">{fee.student}</p>
                  <p className="text-sm text-muted-foreground">{fee.grade} • Due: {fee.dueDate}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold">{fee.amount}</p>
                    <Badge variant={
                      fee.status === 'Paid' ? 'default' :
                      fee.status === 'Pending' ? 'secondary' : 'destructive'
                    }>
                      {fee.status}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" data-testid={`button-view-details-${index}`}>
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card data-testid="card-total-collected">
          <CardHeader>
            <CardTitle className="text-lg">Total Collected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">$171,800</div>
            <p className="text-sm text-muted-foreground mt-1">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card data-testid="card-pending-amount">
          <CardHeader>
            <CardTitle className="text-lg">Pending Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-orange-600">$23,400</div>
            <p className="text-sm text-muted-foreground mt-1">12 students pending</p>
          </CardContent>
        </Card>

        <Card data-testid="card-overdue-amount">
          <CardHeader>
            <CardTitle className="text-lg">Overdue Amount</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">$5,200</div>
            <p className="text-sm text-muted-foreground mt-1">3 students overdue</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
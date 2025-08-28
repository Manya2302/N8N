import { Card, CardContent } from '@/components/ui/card';

export default function StatsCard({ title, value, icon: Icon, color = 'primary', isString = false }) {
  const getColorClasses = (color) => {
    switch (color) {
      case 'primary':
        return 'stat-card text-primary-foreground';
      case 'secondary':
        return 'secondary-stat text-primary-foreground';
      case 'destructive':
        return 'bg-destructive text-destructive-foreground';
      case 'accent':
        return 'bg-accent text-accent-foreground';
      case 'success':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'stat-card text-primary-foreground';
    }
  };

  return (
    <Card className="dashboard-card">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted-foreground text-sm">{title}</p>
            <p className={`text-2xl font-semibold ${isString ? 'text-lg' : ''}`}>
              {value}
            </p>
          </div>
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${getColorClasses(color)}`}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

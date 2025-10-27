import { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface ResultCardProps {
  title: string;
  value: string | number;
  unit?: string;
  description?: string;
  icon?: ReactNode;
  color?: string;
  className?: string;
}

export function ResultCard({
  title,
  value,
  unit,
  description,
  icon,
  color = "from-green-500 to-emerald-600",
  className = ""
}: ResultCardProps) {
  return (
    <Card className={`border-2 border-gray-100 hover:border-green-300 transition-all ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          {icon && (
            <div className={`w-10 h-10 bg-gradient-to-br ${color} rounded-xl flex items-center justify-center`}>
              {icon}
            </div>
          )}
        </div>
        
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-4xl font-black text-gray-900">{value}</span>
          {unit && <span className="text-xl font-semibold text-gray-500">{unit}</span>}
        </div>
        
        {description && (
          <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

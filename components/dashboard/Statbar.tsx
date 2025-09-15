import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, Zap, TrendingUp, Clock } from "lucide-react";

const stats = [
    {
        label: "Credits Remaining",
        value: "847",
        total: "1000",
        icon: Zap,
        color: "text-blue-600",
        progress: 64.7
    },
    {
        label: "Creations This Month",
        value: "23",
        icon: Sparkles,
        color: "text-orange-600",
        trend: "+12% from last month"
    },
    {
        label: "Total Projects",
        value: "156",
        icon: TrendingUp,
        color: "text-green-600",
        trend: "All time"
    },
    {
        label: "Time Saved",
        value: "42h",
        icon: Clock,
        color: "text-yellow-700",
        trend: "This month"
    }
];

export const StatsBar = () => {

    //  const stats = [
    //     {
    //         label: "Credits Remaining",
    //         value: user && (user?.credits + user?.purchasedCredits) - user?.monthlyCreditsUsed,
    //         total: user?.credits,
    //         icon: Zap,
    //         color: "text-blue-600",
    //         progress: (user && ((user?.credits + user?.purchasedCredits) - user?.monthlyCreditsUsed) / user?.credits) || 0
    //     },
    //     {
    //         label: "Image Created",
    //         value: user?.imageGeneratedThisMonth,
    //         icon: Sparkles,
    //         color: "text-orange-600",
    //         trend: "+12% from last month"
    //     },
    //     {
    //         label: "Video Created",
    //         value: user?.videoGeneratedThisMonth,
    //         icon: TrendingUp,
    //         color: "text-green-600",
    //         trend: "All time"
    //     },
    //     {
    //         label: "Time Saved",
    //         value: "42h",
    //         icon: Clock,
    //         color: "text-yellow-700",
    //         trend: "This month"
    //     }
    // ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-8 ">
            {stats.map((stat, index) => (
                <Card key={index} className="card-gradient hover:shadow-lg dark:bg-[#1a1e2d]">
                    <CardContent className="px-4">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            {stat.progress && (
                                <span className="text-xs text-muted-foreground">
                                    {stat.progress}%
                                </span>
                            )}
                        </div>

                        <div className="space-y-1">
                            <div className="flex items-baseline gap-2">
                                <span className="text-2xl font-bold">{stat.value}</span>
                                {stat.total && (
                                    <span className="text-sm text-muted-foreground">/ {stat.total}</span>
                                )}
                            </div>

                            <p className="text-xs text-muted-foreground">{stat.label}</p>

                            {stat.progress && (
                                <Progress
                                    value={stat.progress}
                                    className="h-2 bg-blue-700" // This sets the empty color to yellow-600
                                />
                            )}

                            {stat.trend && (
                                <p className="text-xs text-muted-foreground mt-1">{stat.trend}</p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};
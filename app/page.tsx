'use client'
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Check, Star, Sparkles, Zap, Camera, Video, Palette, Wand2, ArrowRight, Play, Users, Globe, Shield } from "lucide-react";
import { useRouter } from "next/navigation";
import creativeguruLogo from '@/assets/creative-guru-logo.png'
import Image from "next/image";

const creditPlans = [
  {
    credit: 25,
    price: 4.99
  },
  {
    credit: 50,
    price: 9.99
  },
  {
    credit: 100,
    price: 17.99
  }
];

const subscriptionPlans = [
  {
    name: "Free",
    price: 0,
    monthlyCredits: 10,
    features: [
      "10 monthly credits",
      "Basic image generation",
      "Standard video creation",
      "Basic templates",
      "Community support"
    ],
    limitations: [
      "Watermark on exports",
      "Standard processing speed",
      "Basic quality output"
    ],
    icon: Sparkles,
    color: "text-gray-400",
    popular: false
  },
  {
    name: "Pro",
    price: 19.99,
    monthlyCredits: 500,
    features: [
      "500 monthly credits",
      "HD image generation",
      "Premium video effects",
      "Advanced templates library",
      "Priority processing",
      "No watermarks",
      "Batch processing",
      "Custom brand kit",
      "Priority support"
    ],
    limitations: [],
    icon: Zap,
    color: "text-primary",
    popular: true
  }
];

const features = [
  {
    icon: Camera,
    title: "AI Product Images",
    description: "Generate stunning product photos with AI backgrounds and professional lighting"
  },
  {
    icon: Video,
    title: "Promotional Videos",
    description: "Create engaging marketing videos with dynamic effects and animations"
  },
  {
    icon: Palette,
    title: "Brand Consistency",
    description: "Maintain your brand identity across all generated content"
  },
  {
    icon: Wand2,
    title: "Smart Editing",
    description: "AI-powered editing tools for perfect results every time"
  }
];

const stats = [
  { number: "50K+", label: "Content Created" },
  { number: "10K+", label: "Happy Users" },
  { number: "99.9%", label: "Uptime" },
  { number: "24/7", label: "Support" }
];

const LandingPage = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("plans");

  const handleGetStarted = () => {
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-around">
          <nav className="hidden md:flex items-center gap-3 md:gap-10">
            <a href="#features" className="text-muted-foreground hover:text-foreground transition-colors">Features</a>
            <a href="#pricing" className="text-muted-foreground hover:text-foreground transition-colors">Pricing</a>
            <a href="#about" className="text-muted-foreground hover:text-foreground transition-colors">About</a>
          </nav>
          <div className="flex items-center">
            <Button variant="link" onClick={handleGetStarted}>
              Try Free Now
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center max-w-6xl">
          <Badge variant="secondary" className="mb-6 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI-Powered Content Generation
          </Badge>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Build Awesome
            <span className="text-gradient-primary block">AI Content</span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Transform your creative workflow with AI-powered tools. Generate stunning product images, 
            promotional videos, and marketing content in seconds, not hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              variant="link" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              <Play className="w-5 h-5 mr-2" />
              Generate Now for Free
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              View Demo
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-gradient-primary mb-1">{stat.number}</div>
                <div className="text-muted-foreground text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Powerful AI-Driven Features</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to create professional-grade content with the power of artificial intelligence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="card-gradient group hover:scale-105 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center group-hover:shadow-glow-primary transition-all duration-300">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-center">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Perfect for Every Creator</h2>
            <p className="text-xl text-muted-foreground">
              From e-commerce to social media, Creative Guru adapts to your needs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="card-gradient">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle>E-commerce Businesses</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Create professional product images and promotional videos to boost sales and engagement.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Product photography with AI backgrounds
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Marketing videos for social media
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-primary flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Content Creators</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Scale your content production with AI-powered tools designed for creators.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    YouTube thumbnails and covers
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Social media content at scale
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="card-gradient">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-gradient-secondary flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle>Marketing Agencies</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Deliver high-quality campaigns faster with AI-assisted creative workflows.
                </p>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Brand-consistent content generation
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" />
                    Rapid campaign asset creation
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gradient-to-br from-secondary/5 to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Simple, Transparent Pricing</h2>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your creative needs
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="max-w-4xl mx-auto">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="plans">Monthly Plans</TabsTrigger>
              <TabsTrigger value="credits">Buy Credits</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="grid md:grid-cols-2 gap-8">
                {subscriptionPlans.map((plan, index) => (
                  <Card key={index} className={`card-gradient relative ${plan.popular ? 'ring-2 ring-primary shadow-glow-primary' : ''}`}>
                    {plan.popular && (
                      <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
                        <Star className="w-3 h-3 mr-1" />
                        Most Popular
                      </Badge>
                    )}
                    <CardHeader className="text-center">
                      <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-primary flex items-center justify-center`}>
                        <plan.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-2xl">{plan.name}</CardTitle>
                      <div className="flex items-baseline justify-center gap-1">
                        <span className="text-4xl font-bold">${plan.price}</span>
                        {plan.price > 0 && <span className="text-muted-foreground">/month</span>}
                      </div>
                      <p className="text-muted-foreground">{plan.monthlyCredits} monthly credits</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <ul className="space-y-3">
                        {plan.features.map((feature, featureIndex) => (
                          <li key={featureIndex} className="flex items-center gap-3">
                            <Check className="w-4 h-4 text-primary flex-shrink-0" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button 
                        className="w-full" 
                        variant={plan.popular ? "link" : "outline"}
                        onClick={handleGetStarted}
                      >
                        {plan.price === 0 ? "Start Free" : "Get Started"}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="credits">
              <div className="grid md:grid-cols-3 gap-6">
                {creditPlans.map((plan, index) => (
                  <Card key={index} className="card-gradient text-center">
                    <CardHeader>
                      <CardTitle className="text-2xl">{plan.credit} Credits</CardTitle>
                      <div className="text-3xl font-bold text-gradient-primary">${plan.price}</div>
                      <p className="text-muted-foreground text-sm">
                        ${(plan.price / plan.credit).toFixed(2)} per credit
                      </p>
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" variant="outline" onClick={handleGetStarted}>
                        Buy Credits
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <p className="text-muted-foreground">
                  Credits never expire and can be used alongside any subscription plan
                </p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Content?</h2>
          <p className="text-xl text-muted-foreground mb-8">
            Join thousands of creators who are already using AI to scale their content production
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              variant="link" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              Start Creating for Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              onClick={handleGetStarted}
              className="text-lg px-8 py-6"
            >
              Try Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/50 py-12 px-4 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Image src={creativeguruLogo} alt="Creative Guru" className="h-8 w-8" />
                <span className="text-xl font-bold text-gradient-primary">Creative Guru</span>
              </div>
              <p className="text-muted-foreground">
                AI-powered content generation platform for modern creators.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#features" className="hover:text-foreground transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#about" className="hover:text-foreground transition-colors">About</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Careers</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Contact</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Status</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border/50 mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 Creative Guru. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage
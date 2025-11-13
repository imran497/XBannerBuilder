'use client'

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LogoWithText } from "./Logo";
import { ThemeToggle } from "./ThemeToggle";
import InteractiveGrid from "./InteractiveGrid";
import { Palette, Zap, Download, Users, Star, ArrowRight, Sparkles, Twitter } from "lucide-react";

export default function LandingPage() {
  const features = [
    {
      icon: <Palette className="w-6 h-6" />,
      title: "Beautiful Backgrounds",
      description: "Choose from stunning gradients and solid colors to make your banner stand out."
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: "Professional Fonts",
      description: "Access carefully curated fonts including Barrio, Inter, and Montserrat for perfect typography."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Real-time Preview",
      description: "See exactly how your banner will look on X with our authentic profile preview."
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: "High-Quality Export",
      description: "Download banners in perfect 1500×500 resolution with optimized quality for X."
    }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Indie Developer",
      avatar: "SC",
      content: "Created an amazing banner for my dev profile in minutes. The preview feature is incredible!"
    },
    {
      name: "Marcus Johnson",
      role: "Content Creator",
      avatar: "MJ", 
      content: "Finally, a banner tool that actually shows how it looks on X. Game changer!"
    },
    {
      name: "Elena Rodriguez",
      role: "Designer",
      avatar: "ER",
      content: "Love the font selection and gradient options. Professional results every time."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <LogoWithText size={36} />
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Link href="/editor">
                <Button className="font-medium">
                  Get Started <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-20 pb-32 relative overflow-hidden">
        {/* Interactive Grid Background - Behind content */}
        <InteractiveGrid className="z-0" />
        
        {/* Content */}
        <div className="max-w-6xl mx-auto px-6 text-center relative z-10">
          <Badge variant="secondary" className="mb-6">
            <Twitter className="w-3 h-3 mr-1" />
            Perfect for X (Twitter)
          </Badge>

          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Create Stunning
            <span className="text-primary"> X Banners</span>
            <br />in Minutes
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto leading-relaxed">
            Design professional X banners with beautiful gradients, perfect typography, and real-time preview. 
            No design skills required – just point, click, and create.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link href="/editor">
              <Button size="lg" className="text-lg px-8 py-6 shadow-sm">
                Start Creating <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                <Star className="w-4 h-4 text-yellow-500 fill-current" />
              </div>
              <span>Free to use • No signup required</span>
            </div>
          </div>
        </div>
        
        {/* Enhanced background decoration with squares integration */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-40 right-20 w-48 h-48 bg-accent/5 rounded-full blur-2xl pointer-events-none"></div>
        
        {/* Floating geometric elements */}
        <div className="absolute top-32 left-1/4 w-3 h-3 bg-primary/20 rotate-45 rounded-sm pointer-events-none"></div>
        <div className="absolute top-48 right-1/3 w-4 h-4 bg-primary/15 rotate-12 rounded-sm pointer-events-none"></div>
        <div className="absolute bottom-40 left-1/3 w-2 h-2 bg-primary/25 rotate-45 rounded-sm pointer-events-none"></div>
        <div className="absolute bottom-32 right-1/4 w-3 h-3 bg-accent/20 rotate-12 rounded-sm pointer-events-none"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Everything You Need to Create Perfect Banners
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to help you create professional X banners that get noticed.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm border hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary mb-4">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Simple 3-Step Process
            </h2>
            <p className="text-lg text-muted-foreground">
              Create your perfect banner in just a few clicks
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 mx-auto">
                1
              </div>
              <h3 className="font-semibold text-foreground mb-2">Choose Background</h3>
              <p className="text-muted-foreground">Pick from beautiful gradients or solid colors</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 mx-auto">
                2
              </div>
              <h3 className="font-semibold text-foreground mb-2">Add Content</h3>
              <p className="text-muted-foreground">Add text with beautiful fonts and upload images</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold mb-4 mx-auto">
                3
              </div>
              <h3 className="font-semibold text-foreground mb-2">Download</h3>
              <p className="text-muted-foreground">Export in perfect quality for X</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Loved by Creators
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of creators who use our tool daily
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-background rounded-xl p-6 shadow-sm border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">&ldquo;{testimonial.content}&rdquo;</p>
                
                {/* Rating stars */}
                <div className="flex items-center gap-1 mt-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-500 fill-current" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Ready to Create Your Perfect Banner?
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Join thousands of creators and start designing beautiful X banners today.
          </p>
          <Link href="/editor">
            <Button size="lg" className="text-lg px-8 py-6">
              Start Creating Now <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <LogoWithText size={32} />
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <span>© {new Date().getFullYear()} xheader.app</span>
              <span>•</span>
              <span>Made with ❤️ for creators</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
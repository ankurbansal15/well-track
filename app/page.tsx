import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
            <SiteHeader />

    <div className="pl-8 pr-8">
      
      {/* Hero Section */}
<section className="container flex flex-col lg:flex-row items-center gap-8 py-8 lg:py-20">
  <div className="flex flex-col gap-4 lg:w-1/2 text-center lg:text-left">
    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
      Your Digital Health Card <br className="hidden lg:inline" />
      for Proactive <span className="text-primary">Healthcare</span>
    </h1>
    <p className="text-base sm:text-lg text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
      Centralize your health data, get personalized insights, and take control of your well-being with our AI-powered health management platform.
    </p>
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
      <Button size="lg" className="font-semibold w-full sm:w-auto">
        Create Your Health Card
      </Button>
      <Button size="lg" variant="outline" className="font-semibold w-full sm:w-auto">
        Learn More
      </Button>
    </div>
  </div>
  <div className="lg:w-1/2 mt-8 lg:mt-0">
    <Image
      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_9wgXTGL__1737189862687_raw.jpg-gefxh8gMn8HW4IKJii4sjaYZPZPl2z.jpeg"
      alt="Diverse team of healthcare professionals smiling"
      width={600}
      height={600}
      className="rounded-2xl w-full object-cover"
      priority
    />
  </div>
</section>

      {/* Trust Indicators */}
      <section className="container py-12 lg:py-20 border-t">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Why Choose Our Platform?</h2>
        <p className="text-base sm:text-lg text-center text-muted-foreground mb-8 lg:mb-12">Empowering you with cutting-edge health technology</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {[
            {
              icon: ClipboardDocumentListIcon,
              title: "Comprehensive Health Tracking",
              description: "Monitor your daily activities, symptoms, and vital signs in one centralized platform.",
            },
            {
              icon: ChartBarIcon,
              title: "AI-Powered Insights",
              description: "Receive personalized health reports and risk assessments based on your unique data.",
            },
            {
              icon: UserGroupIcon,
              title: "Connect with Specialists",
              description: "Get matched with healthcare providers based on your specific health profile and needs.",
            },
            {
              icon: ChatBubbleBottomCenterTextIcon,
              title: "Personalized Recommendations",
              description: "Receive tailored lifestyle and health management suggestions to improve your well-being.",
            },
            {
              icon: ShieldCheckIcon,
              title: "Secure & Compliant",
              description: "Your health data is protected with state-of-the-art security measures and full regulatory compliance.",
            },
            {
              icon: BoltIcon,
              title: "Proactive Health Management",
              description: "Stay ahead of potential health issues with predictive analytics and early warning systems.",
            },
          ].map((item, i) => (
            <Card key={i} className="border-none shadow-none">
              <CardContent className="pt-6">
                <item.icon className="h-12 w-12 text-primary mb-4 mx-auto lg:mx-0" />
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-center lg:text-left">{item.title}</h3>
                <p className="text-sm sm:text-base text-muted-foreground text-center lg:text-left">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Key Features Section */}
<section className="container py-12 lg:py-20">
  <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">Key Features of Our Platform</h2>
  <p className="text-base sm:text-lg text-center text-muted-foreground mb-8 lg:mb-12 max-w-[800px] mx-auto">
    Discover how our digital health card revolutionizes personal health management
  </p>
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {[
      { name: "Digital Health Card", description: "Store and access your complete medical history securely", color: "bg-[hsl(var(--primary))]" },
      { name: "AI Health Predictions", description: "Get insights into potential future health risks", color: "bg-[hsl(var(--secondary))]" },
      { name: "Lifestyle Tracking", description: "Monitor diet, exercise, sleep, and other vital metrics", color: "bg-[hsl(var(--accent))]" },
      { name: "Personalized Recommendations", description: "Receive tailored advice for improving your health", color: "bg-[hsl(var(--primary))]" },
      { name: "Doctor Matching", description: "Connect with healthcare providers suited to your needs", color: "bg-[hsl(var(--secondary))]" },
      { name: "Health Trends Analysis", description: "Visualize your health progress over time", color: "bg-[hsl(var(--accent))]" },
    ].map((feature, i) => (
      <Card key={i} className="text-center hover:scale-105 transition-transform cursor-pointer">
        <CardContent className="pt-6">
          <div className={`w-16 h-16 mx-auto rounded-2xl bg-primary flex items-center justify-center mb-4`}>
            <ClipboardDocumentListIcon className="h-8 w-8 text-white dark:text-black" />
          </div>
          <h3 className="font-medium text-base sm:text-lg mb-2">{feature.name}</h3>
          <p className="text-sm text-muted-foreground">{feature.description}</p>
        </CardContent>
      </Card>
    ))}
  </div>
</section>

      {/* AI Recommendation Section */}
<section className="container py-12 lg:py-20 border-t">
  <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">
    <div className="lg:w-1/2">
      <Image
        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image_YwXvi09Q_1737189802617_raw.jpg-rC7MUNAKRWg2lMgiiTtr9DBPtGlZtD.jpeg"
        alt="AI-powered healthcare analytics dashboard showing medical professionals analyzing health data visualizations"
        width={500}
        height={500}
        className="rounded-2xl w-full"
      />
    </div>
    <div className="lg:w-1/2 text-center lg:text-left">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 lg:mb-6">
        AI-Driven Health Recommendations
      </h2>
      <p className="text-base sm:text-lg text-muted-foreground mb-6 lg:mb-8">
        Our advanced AI analyzes your health data to provide personalized recommendations, connect you with suitable healthcare providers, and offer insights into community health trends.
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">For Individuals</CardTitle>
            <CardDescription className="text-sm sm:text-base">Personalized health insights and provider matching</CardDescription>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg sm:text-xl">For Providers</CardTitle>
            <CardDescription className="text-sm sm:text-base">Access to anonymized health trends data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  </div>
</section>

      {/* Call to Action */}
<section className="container py-12 lg:py-20 text-center">
  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">Ready to Take Control of Your Health?</h2>
  <p className="text-base sm:text-lg text-muted-foreground mb-8 max-w-[600px] mx-auto">
    Join thousands of users who are already benefiting from our AI-powered health management platform.
  </p>
  <Button size="lg" className="font-semibold w-full sm:w-auto">
    Create Your Digital Health Card Now
  </Button>
</section>

    </div>
    <SiteFooter />
  </div>
  )
}


import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"
import {
  ClipboardDocumentListIcon,
  ChartBarIcon,
  UserGroupIcon,
  ChatBubbleBottomCenterTextIcon,
  ShieldCheckIcon,
  BoltIcon,
  DocumentTextIcon,
  CalendarDaysIcon,
  BeakerIcon,
  HeartIcon,
  CogIcon,
  CameraIcon,
  ShareIcon,
  ChartPieIcon,
  UserIcon,
  MoonIcon,
  SunIcon,
} from "@heroicons/react/24/outline"
import {
  Activity,
  Utensils,
  Dumbbell,
  FileText,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Brain,
  Hospital,
  Users,
  Settings,
  ArrowRight,
} from "lucide-react"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      {/* Hero Section */}
      <section className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-8 pt-12 pb-16 lg:py-20">
          <div className="flex flex-col gap-6 lg:w-1/2 text-center lg:text-left">
            <div className="space-y-4">
              <Badge variant="secondary" className="w-fit mx-auto lg:mx-0">
                🎯 Your Complete Health Companion
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight">
                Your Digital Health Card <br className="hidden lg:inline" />
                for Proactive <span className="text-primary">Healthcare</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-[600px] mx-auto lg:mx-0">
                Centralize your health data, get personalized insights, and take control of your well-being with our
                AI-powered health management platform.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button size="lg" className="font-semibold" asChild>
                <Link href="/signup">Create Your Health Card</Link>
              </Button>
              <Button size="lg" variant="outline" className="font-semibold" asChild>
                <Link href="/login">Already have an account?</Link>
              </Button>
            </div>
          </div>
          <div className="lg:w-1/2 mt-8 lg:mt-0">
            <Image
              src="/hero-image.jpeg"
              alt="Diverse team of healthcare professionals smiling"
              width={600}
              height={600}
              className="rounded-2xl w-full object-cover shadow-2xl"
              priority
            />
          </div>
        </div>
      </section>

      {/* Quick Access Features */}
      <section id="features" className="bg-secondary/10 py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Core Platform Features</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Everything you need to manage your health journey in one comprehensive platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Activity,
                title: "Health Dashboard",
                description: "Comprehensive overview of your health metrics and progress",
                href: "/dashboard",
                color: "text-green-600",
              },
              {
                icon: ClipboardDocumentListIcon,
                title: "Digital Health Card",
                description: "Centralized medical records and health information",
                href: "/health-card",
                color: "text-blue-600",
              },
              {
                icon: Utensils,
                title: "Food Tracking",
                description: "Track nutrition with AI-powered food analysis",
                href: "/tracking/food",
                color: "text-orange-600",
              },
              {
                icon: Dumbbell,
                title: "Exercise Tracking",
                description: "Monitor workouts and fitness progress",
                href: "/tracking/exercise",
                color: "text-purple-600",
              },
              {
                icon: MoonIcon,
                title: "Sleep Analysis",
                description: "Track sleep patterns and quality",
                href: "/tracking/sleep",
                color: "text-indigo-600",
              },
              {
                icon: FileText,
                title: "Health Reports",
                description: "AI-generated insights and recommendations",
                href: "/reports",
                color: "text-pink-600",
              },
              {
                icon: Target,
                title: "Diet Plans",
                description: "Personalized nutrition plans",
                href: "/diet-plan",
                color: "text-emerald-600",
              },
              {
                icon: Calendar,
                title: "Exercise Plans",
                description: "Custom workout routines",
                href: "/exercise-plan",
                color: "text-red-600",
              },
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/20">
                  <CardContent className="p-6 text-center">
                    <feature.icon className={`h-12 w-12 mx-auto mb-4 ${feature.color}`} />
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-3">{feature.description}</p>
                    <ArrowRight className="h-4 w-4 mx-auto text-muted-foreground group-hover:text-primary transition-colors" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Advanced Health Management</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Leverage cutting-edge technology for comprehensive health monitoring and analysis
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <Brain className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">AI-Powered Analytics</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Get intelligent insights from your health data with advanced machine learning algorithms
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <ChartBarIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Health risk assessments</span>
                </div>
                <div className="flex items-center gap-2">
                  <BoltIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Predictive health analytics</span>
                </div>
                <div className="flex items-center gap-2">
                  <ChatBubbleBottomCenterTextIcon className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Personalized recommendations</span>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/reports">
                    View Sample Report <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="relative overflow-hidden group hover:shadow-xl transition-all duration-300">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <CameraIcon className="h-8 w-8 text-primary" />
                  <CardTitle className="text-xl">Smart Food Recognition</CardTitle>
                </div>
                <CardDescription className="text-base">
                  Simply take a photo of your meal for instant nutritional analysis
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Utensils className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Automatic calorie calculation</span>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Macro & micronutrient breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-muted-foreground" />
                  <span className="text-sm">Dietary goal tracking</span>
                </div>
                <Button className="w-full mt-4" variant="outline" asChild>
                  <Link href="/tracking/food">
                    Try Food Scanner <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: ShareIcon,
                title: "Shareable Reports",
                description: "Securely share health data with healthcare providers",
                href: "/reports",
              },
              {
                icon: ChartPieIcon,
                title: "Health Metrics",
                description: "Track vital signs and health indicators over time",
                href: "/metrics",
              },
              {
                icon: UserIcon,
                title: "Personal Profile",
                description: "Manage your health profile and preferences",
                href: "/profile",
              },
              {
                icon: CalendarDaysIcon,
                title: "Activity History",
                description: "View comprehensive history of all health activities",
                href: "/dashboard/history",
              },
              {
                icon: BeakerIcon,
                title: "Health Insights",
                description: "Get detailed analysis of your health patterns",
                href: "/tracking",
              },
              {
                icon: CogIcon,
                title: "Settings",
                description: "Customize your health tracking preferences",
                href: "/settings",
              },
            ].map((feature, i) => (
              <Link key={i} href={feature.href} className="group">
                <Card className="h-full transition-all duration-300 hover:shadow-md hover:scale-105">
                  <CardContent className="p-6 text-center">
                    <feature.icon className="h-8 w-8 text-primary mx-auto mb-3" />
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="specialties" className="bg-muted/30 py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Why Choose WellTrack?</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Empowering you with cutting-edge health technology and comprehensive care
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: ShieldCheckIcon,
                title: "Secure & Compliant",
                description: "Your health data is protected with state-of-the-art security measures and full regulatory compliance.",
              },
              {
                icon: BoltIcon,
                title: "AI-Powered Insights",
                description: "Receive personalized health reports and risk assessments based on your unique data patterns.",
              },
              {
                icon: UserGroupIcon,
                title: "Comprehensive Tracking",
                description: "Monitor your daily activities, symptoms, and vital signs in one centralized platform.",
              },
              {
                icon: Hospital,
                title: "Healthcare Integration",
                description: "Seamlessly share data with healthcare providers and get professional medical insights.",
              },
              {
                icon: Zap,
                title: "Real-time Analytics",
                description: "Get instant feedback and recommendations based on your current health metrics and trends.",
              },
              {
                icon: Users,
                title: "Community Support",
                description: "Connect with a community of health-conscious individuals and share your journey.",
              },
            ].map((item, i) => (
              <Card key={i} className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <CardContent className="p-8 text-center">
                  <item.icon className="h-12 w-12 text-primary mb-6 mx-auto" />
                  <h3 className="text-xl font-semibold mb-4">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Section */}
      <section className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <div className="lg:w-1/2">
              <Image
                src="/infographic.jpeg"
                alt="AI-powered healthcare analytics dashboard showing medical professionals analyzing health data visualizations"
                width={500}
                height={500}
                className="rounded-2xl w-full shadow-xl"
              />
            </div>
            <div className="lg:w-1/2 text-center lg:text-left">
              <Badge variant="secondary" className="mb-4">
                🤖 AI-Powered Intelligence
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">Smart Health Recommendations</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Our advanced AI analyzes your health data to provide personalized recommendations, connect you with
                suitable healthcare providers, and offer insights into community health trends.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <Card className="border-primary/20">
                  <CardHeader className="px-6 py-5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <UserIcon className="h-5 w-5 text-primary" />
                      For Individuals
                    </CardTitle>
                    <CardDescription className="text-base">
                      Personalized health insights and provider matching
                    </CardDescription>
                  </CardHeader>
                </Card>
                <Card className="border-primary/20">
                  <CardHeader className="px-6 py-5">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Hospital className="h-5 w-5 text-primary" />
                      For Providers
                    </CardTitle>
                    <CardDescription className="text-base">
                      Access to anonymized health trends data
                    </CardDescription>
                  </CardHeader>
                </Card>
              </div>
              <Button size="lg" asChild>
                <Link href="/signup">
                  Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section id="articles" className="bg-gradient-to-r from-primary/5 to-secondary/5 py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Get Started in 3 Simple Steps</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Begin your health journey with our easy-to-follow setup process
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              {
                step: "01",
                title: "Create Your Account",
                description: "Sign up and complete your initial health assessment",
                action: "Sign Up",
                href: "/signup",
                icon: UserIcon,
              },
              {
                step: "02", 
                title: "Fill Health Form",
                description: "Complete your comprehensive health profile and medical history",
                action: "Health Form",
                href: "/initial-health-form",
                icon: ClipboardDocumentListIcon,
              },
              {
                step: "03",
                title: "Start Tracking",
                description: "Begin monitoring your daily activities, nutrition, and wellness metrics",
                action: "Start Tracking",
                href: "/tracking",
                icon: Activity,
              },
            ].map((step, i) => (
              <Card key={i} className="relative text-center group hover:shadow-xl transition-all duration-300">
                <CardContent className="p-8">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                      {step.step}
                    </div>
                  </div>
                  <step.icon className="h-12 w-12 text-primary mx-auto mb-4 mt-4" />
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground mb-6">{step.description}</p>
                  <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors" asChild>
                    <Link href={step.href}>{step.action}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground max-w-[700px] mx-auto">
              Everything you need to know about WellTrack
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {[
              {
                question: "How secure is my health data?",
                answer: "Your health data is protected with enterprise-grade encryption and complies with all healthcare privacy regulations including HIPAA."
              },
              {
                question: "Can I share my health card with doctors?",
                answer: "Yes, you can securely share your digital health card and reports with healthcare providers through our platform."
              },
              {
                question: "How does AI food recognition work?",
                answer: "Simply take a photo of your meal and our AI will automatically identify foods and calculate nutritional information."
              },
              {
                question: "Is the platform suitable for all ages?",
                answer: "WellTrack is designed for adults. For users under 18, parental consent and supervision are required."
              },
              {
                question: "Can I export my health data?",
                answer: "Yes, you can export your health reports as PDFs and download your data at any time."
              },
              {
                question: "How accurate are the health insights?",
                answer: "Our AI provides evidence-based insights, but they should complement, not replace, professional medical advice."
              },
            ].map((faq, i) => (
              <Card key={i} className="p-6 hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-lg mb-3 text-primary">{faq.question}</h3>
                <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final Call to Action */}
      <section className="bg-primary text-primary-foreground py-16 lg:py-20">
        <div className="container mx-auto px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-10 max-w-[700px] mx-auto">
            Join thousands of users who are already benefiting from our AI-powered health management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="font-semibold text-lg px-8" asChild>
              <Link href="/signup">Create Your Digital Health Card Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="font-semibold text-lg px-8 bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/login">Already Have an Account?</Link>
            </Button>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}


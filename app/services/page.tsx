import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Globe, Smartphone, ShoppingCart, Search, Palette, Code, CheckCircle, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function ServicesPage() {
  const services = [
    {
      icon: Globe,
      title: "Website Development",
      description: "Modern, responsive websites जो आपके business को online represent करें।",
      features: ["Responsive Design", "Fast Loading", "SEO Optimized", "Mobile Friendly"],
      price: "₹15,000 से शुरू",
      color: "text-blue-600",
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description: "Complete online store setup के साथ payment gateway integration।",
      features: ["Product Management", "Payment Gateway", "Order Management", "Inventory System"],
      price: "₹25,000 से शुरू",
      color: "text-green-600",
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Android और iOS के लिए native mobile applications।",
      features: ["Cross Platform", "Native Performance", "App Store Ready", "Push Notifications"],
      price: "₹50,000 से शुरू",
      color: "text-purple-600",
    },
    {
      icon: Search,
      title: "SEO & Digital Marketing",
      description: "आपकी online visibility बढ़ाने के लिए complete SEO solutions।",
      features: ["Keyword Research", "On-page SEO", "Content Marketing", "Analytics"],
      price: "₹10,000/month से शुरू",
      color: "text-orange-600",
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "User-friendly और attractive designs जो conversion बढ़ाएं।",
      features: ["User Research", "Wireframing", "Prototyping", "Design System"],
      price: "₹8,000 से शुरू",
      color: "text-pink-600",
    },
    {
      icon: Code,
      title: "Custom Development",
      description: "आपकी specific requirements के लिए custom software solutions।",
      features: ["Custom Features", "API Integration", "Database Design", "Maintenance"],
      price: "Quote पर आधारित",
      color: "text-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Services</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            हम comprehensive digital solutions provide करते हैं जो आपके business को next level पर ले जाने में help करते हैं।
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          {services.map((service, index) => {
            const IconComponent = service.icon
            return (
              <Card key={index} className="h-full">
                <CardHeader>
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-lg bg-gray-50`}>
                      <IconComponent className={`h-8 w-8 ${service.color}`} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{service.title}</CardTitle>
                      <div className="text-lg font-semibold text-green-600 mt-1">{service.price}</div>
                    </div>
                  </div>
                  <CardDescription className="text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 mb-6">
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" asChild>
                    <Link href="/contact">
                      Get Quote <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Process Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Process</h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Discussion</h3>
              <p className="text-gray-600">आपकी requirements को समझना और planning करना।</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-green-600">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Design</h3>
              <p className="text-gray-600">Creative designs और wireframes बनाना।</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-purple-600">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Development</h3>
              <p className="text-gray-600">Coding और development phase।</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-orange-600">4</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Launch</h3>
              <p className="text-gray-600">Testing, deployment और maintenance।</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Your Project?</h2>
          <p className="text-xl mb-8 opacity-90">हमसे contact करें और free consultation पाएं</p>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/contact">
              Get Free Consultation <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

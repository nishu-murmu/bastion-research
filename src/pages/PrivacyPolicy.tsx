import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10">
      <header className="flex justify-between items-center p-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          <Link to="/">MyApp</Link>
        </h1>
        <nav className="flex items-center gap-4">
          <Button asChild variant="ghost">
            <Link to="/">Home</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/contact">Contact</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link to="/refund-policy">Refund</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/auth?mode=sign-in">Sign In</Link>
          </Button>
        </nav>
      </header>
      
      <div className="flex justify-center py-20">
        <div className="max-w-4xl w-full px-4">
          <Card>
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">Information We Collect</h3>
                  <p className="text-muted-foreground">
                    We collect information you provide directly to us, such as when you create an account, 
                    update your profile, or contact us. This includes your name, email address, phone number, 
                    address, PAN card number, GST number, and other business information.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">How We Use Your Information</h3>
                  <p className="text-muted-foreground">
                    We use the information we collect to provide, maintain, and improve our services, 
                    process transactions, send you technical notices and support messages, and communicate 
                    with you about products, services, and promotional offers.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Information Sharing</h3>
                  <p className="text-muted-foreground">
                    We do not sell, trade, or otherwise transfer your personal information to third parties 
                    without your consent, except as described in this privacy policy or as required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Data Security</h3>
                  <p className="text-muted-foreground">
                    We implement appropriate security measures to protect your personal information against 
                    unauthorized access, alteration, disclosure, or destruction. However, no method of 
                    transmission over the Internet is 100% secure.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Your Rights</h3>
                  <p className="text-muted-foreground">
                    You have the right to access, update, or delete your personal information. You may also 
                    opt out of certain communications from us. To exercise these rights, please contact us 
                    using the information provided on our Contact page.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                  <p className="text-muted-foreground">
                    If you have any questions about this Privacy Policy, please contact us through our 
                    Contact page or by email.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
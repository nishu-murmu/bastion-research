import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

const RefundPolicy = () => {
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
            <Link to="/privacy-policy">Privacy</Link>
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
              <CardTitle className="text-3xl font-bold">Refund Policy</CardTitle>
              <CardDescription>
                Last updated: {new Date().toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent className="prose prose-slate max-w-none">
              <div className="space-y-6">
                <section>
                  <h3 className="text-xl font-semibold mb-3">Refund Eligibility</h3>
                  <p className="text-muted-foreground">
                    We offer refunds for our services under specific circumstances. Refund requests must be 
                    made within 30 days of the original purchase date. The service must not have been 
                    extensively used, and you must provide a valid reason for the refund request.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Refund Process</h3>
                  <p className="text-muted-foreground">
                    To request a refund, please contact our customer support team through the Contact page. 
                    Include your order number, the reason for the refund request, and any relevant details. 
                    We will review your request within 5-7 business days.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Processing Time</h3>
                  <p className="text-muted-foreground">
                    Once your refund is approved, it will be processed within 7-10 business days. The refund 
                    will be credited back to the original payment method used for the purchase. Please note 
                    that depending on your payment provider, it may take additional time for the refund to 
                    appear in your account.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Non-Refundable Items</h3>
                  <p className="text-muted-foreground">
                    Certain services and products are non-refundable, including but not limited to: services 
                    that have been fully delivered, custom development work that has been completed, and 
                    services used beyond the trial period.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Partial Refunds</h3>
                  <p className="text-muted-foreground">
                    In some cases, we may offer partial refunds based on the extent of service usage. 
                    This will be determined on a case-by-case basis and communicated to you during the 
                    refund review process.
                  </p>
                </section>

                <section>
                  <h3 className="text-xl font-semibold mb-3">Contact Us</h3>
                  <p className="text-muted-foreground">
                    If you have any questions about our refund policy or need to request a refund, 
                    please contact us through our Contact page. Our support team is here to help you.
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

export default RefundPolicy;
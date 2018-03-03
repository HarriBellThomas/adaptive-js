registerNamespace("uk.org.adaptive.passwordReveal");

self.isActive = false;

registerNSMethod(self, "apply", function() {
   if (self.isActive) self.remove();
   
   self.isActive = true;
});

registerNSMethod(self, "remove", function() {
   self.isActive = false;
});
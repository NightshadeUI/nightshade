## **Introduction**

### What's a design system?

We believe that, at its core, a **design system** is a structured set of _guidelines_ and _constraints_ for establishing visual and functional identity, and improving productivity.

A _good_ design system aims at striking the perfect balance in the following conflicting areas.

### Consistency vs. Freedom

Your product needs to look and feel coherent. Simply put: if you take a couple of screenshots from different parts of the product and put them together, they should look like pieces of the same puzzle. That's the argument for **consistency**.

Consistency is generally regarded as one of the key qualities that makes a product pleasant to look at and satisfying to use — because it gives the user the sense of control and predictability.

On the other hand, your product needs to stand out amongst the myriad of other products.

A meticulously crafted but overly rigid design system is prone to producing products that look a bit too similar to each other. This is especially a concern for widely popular design systems (Material, Carbon, Fluent, Bootstrap in earlier days, etc).

A _good_ design system should recognize the need for a certain degree of **creative freedom** and provide means of facilitating different design intents beyond the ones that were explicitly defined in it.

### Speed vs. Depth

A good design system would always recognize **the Time** as the World's only non-renewable resource, thus will strive to minimize the time it takes to deliver things to the users.

For this reason, most design systems come packaged with:

- a large number of ready-made UI components that cover the most common interaction patterns;
- a selection of color palettes to tailor the product/brand identity with;
- various helpers and utilities to address common concerns like layouts, responsive design, accessibility, etc.
- hopefully, some guidelines to eliminate common micro-decisions.

A _good_ design system will recognize that ultimately, against all odds, the speed gains from streamlining the decisions can become offset by not making the right decisions in the first place.

<small>
Sounds controversial? Let's make a contrieved example of an interaction pattern that requires "Save" button on every editing screen. This rule is quite easy to follow: just don't forget the usual "Save" and "Cancel" button on every form in your application. Follow this rule for 100% consistency and 100% speed.<br/><br/>
Of course, not <em>needing</em> to have a Save button could ultimately be better for the end users, who would no longer ponder whether they'd lose their precious changes by clicking "Cancel". By the time we realize that, the product is already built.
</small>

Another factor that affects speed is **complexity**. The more the design system has to offer (components, rules, guidelines, abstraction layers), the steeper the learning curve becomes, the more time it takes to make the "how" decisions.

Ultimately, complexity affects the consistency as well: the more recipes and patterns exist, the more difficult it becomes to choose the right one.

### Scalable Design System

Nightshade is a **scalable design system**, the one that scales with your needs.

Rather than providing tons of off the shelf solutions, it covers the essentials and then gives you the means to build the rest.

You start small, with minimal complexity, but with some foundations to facilitate important decisions such as naming conventions, typography, colors, layouts, spacing, responsiveness and dual-theme support.

As your application grows in size and complexity, you build the rest of the design system on top of it: add new rules and guidelines, build new components or import third-party ones, etc. This way you opt-in for more complexity as and when you need it, instead of accepting the complexity by default.

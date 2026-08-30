# attest-shop

The application Attest watches. One product, one checkout route, one database
table. Deliberately tiny so that a full repair-and-validate cycle fits inside
the incident's time budget.

## Run it

```bash
npm ci
DATABASE_URL=postgres://... npm run dev
```

The `orders` table is created on the first checkout, so there is no migration
step.

## Deploy it

```bash
npx vercel --yes
npx vercel env add DATABASE_URL
```

`vercel.json` pins the framework and both commands, so the build does not
depend on auto-detection or on project settings someone has to remember.

Then point Attest at the deployment: set the project's Vercel project id in
Setup so rollback and the last-good gate can work.

## The break

`app/api/checkout/route.ts` handles guest checkout, where the payment session
has no customer object:

```ts
const customerId = session?.customer?.id ?? "guest";
```

Removing that guard is the one-line change that takes the checkout down:

```diff
- const customerId = session?.customer?.id ?? "guest";
+ const customerId = session.customer.id;
```

The route then throws `TypeError: Cannot read properties of null (reading 'id')`,
returns a 500, and the storefront shows its error state.

It is a good defect to demonstrate against because the lazy repair — catching
the exception and returning a plausible order id — makes the browser journey
pass while no order is ever written. The sealed oracle asks the database
whether the order exists and is marked paid, which is a question the HTTP
journey cannot ask.

import { Button } from '@/components/Button';

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gray-faint p-2xl">
      <div className="text-center mb-3xl">
        <h1 className="text-5xl font-bold text-default mb-md">
          Button Component
        </h1>
        <p className="text-xl text-default-lighter">
          Using Figma Design Tokens
        </p>
      </div>

      {/* Button Sizes Demo */}
      <section className="w-full max-w-6xl mb-3xl">
        <h2 className="text-2xl font-semibold text-default mb-lg">Sizes</h2>

        <div className="bg-white p-xl rounded-lg border border-gray-light flex gap-20">
          <div className='flex flex-col gap-10'>
            <div className="flex gap-md items-center">
              <Button variant="primary" size="sm">Label</Button>
              <Button variant="primary" size="sm">Label</Button>
              <Button variant="primary" size="sm" showAsHover>Label</Button>
              <Button variant="primary" size="sm" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="secondary" size="sm">Label</Button>
              <Button variant="secondary" size="sm">Label</Button>
              <Button variant="secondary" size="sm" showAsHover>Label</Button>
              <Button variant="secondary" size="sm" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="tertiary" size="sm">Label</Button>
              <Button variant="tertiary" size="sm">Label</Button>
              <Button variant="tertiary" size="sm" showAsHover>Label</Button>
              <Button variant="tertiary" size="sm" disabled>Label</Button>
            </div>
          </div>
          <div className='flex flex-col gap-10'>
            <div className="flex gap-md items-center">
              <Button variant="primary" size="md">Label</Button>
              <Button variant="primary" size="md">Label</Button>
              <Button variant="primary" size="md" showAsHover>Label</Button>
              <Button variant="primary" size="md" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="secondary" size="md">Label</Button>
              <Button variant="secondary" size="md">Label</Button>
              <Button variant="secondary" size="md" showAsHover>Label</Button>
              <Button variant="secondary" size="md" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="tertiary" size="md">Label</Button>
              <Button variant="tertiary" size="md">Label</Button>
              <Button variant="tertiary" size="md" showAsHover>Label</Button>
              <Button variant="tertiary" size="md" disabled>Label</Button>
            </div>
          </div>
          <div className='flex flex-col gap-10'>
            <div className="flex gap-md items-center">
              <Button variant="primary" size="lg">Label</Button>
              <Button variant="primary" size="lg">Label</Button>
              <Button variant="primary" size="lg" showAsHover>Label</Button>
              <Button variant="primary" size="lg" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="secondary" size="lg">Label</Button>
              <Button variant="secondary" size="lg">Label</Button>
              <Button variant="secondary" size="lg" showAsHover>Label</Button>
              <Button variant="secondary" size="lg" disabled>Label</Button>
            </div>
            <div className="flex gap-md items-center">
              <Button variant="tertiary" size="lg">Label</Button>
              <Button variant="tertiary" size="lg">Label</Button>
              <Button variant="tertiary" size="lg" showAsHover>Label</Button>
              <Button variant="tertiary" size="lg" disabled>Label</Button>
            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
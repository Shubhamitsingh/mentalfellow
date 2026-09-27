import { Button } from '@/components/ui/Button'

export function ErrorState({ title = 'Something went wrong', message, onRetry }) {
  return (
    <div role="alert" className="flex flex-col items-start py-16">
      <h2 className="font-serif text-4xl">{title}</h2>
      <p className="mt-3 max-w-md text-muted">{message || 'Check your connection and try again.'}</p>
      {onRetry ? (
        <Button className="mt-8" onClick={onRetry}>
          Try again
        </Button>
      ) : null}
    </div>
  )
}

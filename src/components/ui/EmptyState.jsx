import { ButtonLink } from '@/components/ui/Button'

export function EmptyState({ title, message, action, href }) {
  return (
    <div className="flex flex-col items-start py-16">
      <h2 className="font-serif text-4xl md:text-5xl">{title}</h2>
      {message ? <p className="mt-3 max-w-md text-muted">{message}</p> : null}
      {href && action ? (
        <ButtonLink to={href} className="mt-8">
          {action}
        </ButtonLink>
      ) : null}
    </div>
  )
}

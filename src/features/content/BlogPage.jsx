import { Link, useParams } from 'react-router-dom'
import { ButtonLink } from '@/components/ui/Button'
import { Container } from '@/components/ui/Container'
import { formatPostDate, postBySlug, postsByDate } from '@/content/blog'
import { usePageMeta } from '@/hooks/usePageMeta'

export default function BlogPage() {
  const notes = postsByDate()
  usePageMeta({
    title: 'Blog',
    description: 'Notes from Mental Fellow on rice straw leather, wheat straw suede, and the pieces made from them.',
    path: '/blog',
  })

  return (
    <Container className="py-12 md:py-16">
      <header>
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Journal</p>
        <h1 className="mt-3 font-serif text-5xl leading-none text-leaf md:text-6xl">Blog</h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">Notes on the materials, and on the pieces made from them.</p>
      </header>
      <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-2">
        {notes.map((post) => (
          <li key={post.slug}>
            <NoteCard post={post} />
          </li>
        ))}
      </ul>
    </Container>
  )
}

function NoteCard({ post }) {
  return (
    <article className="group h-full">
      <Link to={`/blog/${post.slug}`} className="block overflow-hidden rounded-2xl bg-paper-2">
        <img
          src={post.image}
          alt=""
          style={{ objectPosition: post.imagePosition || 'center' }}
          className="aspect-[16/10] w-full object-cover transition duration-700 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="mt-4 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted">
        <span>{post.category}</span>
        <span className="h-px w-6 bg-line" aria-hidden="true" />
        <time dateTime={post.date}>{formatPostDate(post.date)}</time>
      </div>
      <h2 className="mt-3 font-serif text-3xl leading-[1.1] md:text-4xl">
        <Link to={`/blog/${post.slug}`} className="hover:text-leaf">
          {post.title}
        </Link>
      </h2>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted md:text-base">{post.excerpt}</p>
      <Link to={`/blog/${post.slug}`} className="mt-4 inline-block text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
        Read
      </Link>
    </article>
  )
}

export function BlogPostPage() {
  const { slug } = useParams()
  const post = postBySlug(slug)
  const others = postsByDate().filter((item) => item.slug !== slug).slice(0, 2)
  usePageMeta({
    title: post?.title || 'Blog',
    description: post?.excerpt,
    path: `/blog/${slug || ''}`,
  })

  if (!post) {
    return (
      <Container className="max-w-3xl py-12 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.18em] text-muted">Journal</p>
        <h1 className="mt-3 font-serif text-5xl">This note is not here.</h1>
        <Link to="/blog" className="mt-8 inline-block text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
          Back to the blog
        </Link>
      </Container>
    )
  }

  return (
    <article>
      <Container className="max-w-3xl pt-10 md:pt-14">
        <Link to="/blog" className="text-[11px] uppercase tracking-[0.16em] text-leaf underline underline-offset-4">
          Blog
        </Link>
        <div className="mt-8 flex items-center gap-3 text-[11px] uppercase tracking-[0.16em] text-muted">
          <span>{post.category}</span>
          <span className="h-px w-6 bg-line" aria-hidden="true" />
          <time dateTime={post.date}>{formatPostDate(post.date)}</time>
        </div>
        <h1 className="mt-4 font-serif text-4xl leading-[1.05] md:text-6xl">{post.title}</h1>
        <p className="mt-5 font-serif text-2xl leading-snug text-ink/80">{post.excerpt}</p>
      </Container>
      <Container className="max-w-5xl py-8 md:py-10">
        <img
          src={post.image}
          alt={post.alt}
          style={{ objectPosition: post.imagePosition || 'center' }}
          className="aspect-[16/9] w-full rounded-2xl object-cover"
        />
      </Container>
      <Container className="max-w-3xl pb-12 md:pb-16">
        <div>
          {post.sections.map((section) => (
            <section key={section.heading} className="border-t border-line py-8">
              <h2 className="font-serif text-3xl leading-tight">{section.heading}</h2>
              <div className="mt-4 space-y-4 text-base leading-relaxed">
                {section.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
        {post.shop ? (
          <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-line bg-white px-6 py-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-muted">In the shop</p>
              <p className="mt-2 font-serif text-2xl leading-tight">{post.shop.line}</p>
            </div>
            <ButtonLink to={post.shop.href} variant="secondary" className="w-fit shrink-0">
              {post.shop.label}
            </ButtonLink>
          </div>
        ) : null}
      </Container>
      {others.length ? (
        <div className="border-t border-line">
          <Container className="py-12 md:py-16">
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted">More from the journal</p>
            <ul className="mt-8 grid gap-10 md:grid-cols-2">
              {others.map((item) => (
                <li key={item.slug}>
                  <NoteCard post={item} />
                </li>
              ))}
            </ul>
          </Container>
        </div>
      ) : null}
    </article>
  )
}

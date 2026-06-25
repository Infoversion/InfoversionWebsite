import type { Metadata } from 'next'
import { Quote } from 'lucide-react'

export const metadata: Metadata = {
  title: 'From the CEO',
  description: 'A note from Ozma A., CEO of Infoversion — on purpose, products, and the journey that shaped the company.',
}

export default function FromTheCEOPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-semibold tracking-[0.2em] uppercase gradient-text mb-4">
        From the CEO
      </p>
      <h1 className="text-5xl font-bold text-text-primary mb-4">A note from our founder</h1>
      <p className="text-text-secondary text-lg mb-16 max-w-xl">
        On purpose, products, and the journey that brought Infoversion into existence.
      </p>

      <div className="space-y-8 text-text-secondary leading-relaxed text-[1.05rem]">
        <p>
          At Infoversion, we do not build software for the sake of it. Every product we create
          starts with a single question: does this actually matter to someone? Our vision is to
          build platforms where families come together to preserve and share their heritage across
          generations, where a presenter can reach every person in the room without a projector or a
          shared screen, and where a simple game becomes something that genuinely sharpens how you
          think. These may sound like modest ambitions. They are not. Connection, communication, and
          cognition — these are the things that shape how people live, and they deserve software
          that takes them seriously.
        </p>

        <p>
          The products we are building reflect that belief directly. Bazidpur — our first live
          app — is a private platform for a community whose roots trace back to a historic village
          in Bihar, India, founded around 1500 AD. Heritage, which follows, will open that same
          idea to any family on earth: a culture-aware, multi-generational platform that works for
          communities the major genealogy tools were never designed to serve. PresentPro addresses
          something I have witnessed firsthand in boardrooms and lecture halls — the audience is
          present, the ideas are ready, but a shared screen is not. And T3 reimagines tic-tac-toe
          not as a novelty, but as a game with genuine depth: adaptive AI, a strategic ultimate
          mode, and AR that anchors the board to any real surface. Each product starts with a
          problem that was already there, waiting to be solved properly.
        </p>

        <p>
          Building products the right way takes time. A thoughtfully made application does not ship
          in a month, and the level of craft we hold ourselves to demands even more. So alongside
          our own product roadmap, we work with individuals and businesses who need well-built,
          cost-effective custom applications. This is not a side hustle — it is how a serious
          software company sustains itself. The client work funds the runway that product development
          requires, and the product work keeps us sharp and honest about what good software actually
          looks like. Both make each other better.
        </p>

        <p>
          I studied in New Jersey and spent years working across the pharmaceutical and travel
          industries — first in the United States, then in Switzerland. Both sectors taught me
          the same uncomfortable truth: the people who build software are rarely the people who
          depend on it most, and that gap shows up everywhere. I saw it in enterprise tools that
          needed three training sessions before anyone could use them properly, and in consumer
          products that looked polished in a demo but quietly failed the people whose real lives
          they were supposed to improve. I left those roles not out of dissatisfaction, but because
          I wanted to build something without those compromises.
        </p>

        <p>
          I took time to step back and think. That time took me through the United Kingdom, Italy,
          Germany, India, Pakistan, Bahrain, and Saudi Arabia. Not as a tourist moving between
          landmarks, but as someone genuinely curious about how people in different cultures live,
          stay connected, and make sense of where they come from. In every country, across every
          context, the same patterns emerged: people want to belong. They want to keep their
          families close across distances. They want to be heard in rooms where the technology
          should help and instead gets in the way. The problems are almost always human — the tools
          just need to catch up.
        </p>

        <p>
          That is what I came back with — not a business plan, but a conviction. The most valuable
          software earns its place in people&apos;s lives because it solves something real, not because
          it captured a trend at the right moment. Infoversion exists to build exactly that. I hope
          what you see here reflects it. And if there is something you need built — something that
          matters to you or your users — I would genuinely like to hear about it.
        </p>
      </div>

      <div className="mt-16 flex items-center gap-4">
        <div className="gradient-bg w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
          <Quote className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-text-primary font-semibold">Ozma A.</p>
          <p className="text-text-secondary text-sm">Chief Executive Officer, Infoversion LLC</p>
        </div>
      </div>
    </div>
  )
}

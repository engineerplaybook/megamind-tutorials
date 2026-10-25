import type { ReactNode } from 'react';
import {
  Atom,
  Boxes,
  CheckCircle2,
  Code2,
  Gauge,
  Lightbulb,
  RefreshCw,
  Share2,
  ToggleLeft,
  Zap,
} from 'lucide-react';
import { CoursePlayer } from '@/src/components/course/CoursePlayer';
import { SlideHeader, ease, slideIn } from '@/src/components/course/SlideHeader';
import type { Course, CourseModule } from '@/src/courses/types';
import { motion } from 'framer-motion';
import ContextDemo from './demos/ContextDemo';
import EffectDemo from './demos/EffectDemo';
import StateDemo from './demos/StateDemo';
import TransitionDemo from './demos/TransitionDemo';

const moduleStyles = {
  overview: { accent: 'from-sky-500 to-cyan-500', from: 'from-sky-900/25', to: 'to-cyan-900/15' },
  jsx: { accent: 'from-blue-500 to-indigo-500', from: 'from-blue-900/25', to: 'to-indigo-900/15' },
  state: { accent: 'from-emerald-500 to-teal-500', from: 'from-emerald-900/25', to: 'to-teal-900/15' },
  effect: { accent: 'from-amber-500 to-orange-500', from: 'from-amber-900/20', to: 'to-orange-900/10' },
  context: { accent: 'from-pink-500 to-rose-500', from: 'from-pink-900/25', to: 'to-rose-900/15' },
  transition: { accent: 'from-purple-500 to-fuchsia-500', from: 'from-purple-900/30', to: 'to-fuchsia-900/20' },
  performance: { accent: 'from-lime-500 to-green-500', from: 'from-lime-900/20', to: 'to-green-900/15' },
  summary: { accent: 'from-emerald-500 to-green-500', from: 'from-emerald-900/25', to: 'to-green-900/15' },
};

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-xl border border-white/10 bg-slate-950/80 p-3 text-[11px] leading-relaxed text-emerald-300">
      <code className="bg-transparent p-0 font-mono text-emerald-300">{children}</code>
    </pre>
  );
}

function Callout({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-purple-500/15 bg-purple-500/5 p-3.5">
      <p className="mb-1 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-purple-300">
        <Lightbulb size={12} /> {title}
      </p>
      <div className="text-xs leading-relaxed text-gray-400">{children}</div>
    </div>
  );
}

function DemoFrame({ title, children }: { title: string; children: ReactNode }) {
  return (
    <motion.div {...slideIn} className="overflow-hidden rounded-2xl border border-white/10 bg-white shadow-2xl">
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-100 px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-emerald-500" />
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
      </div>
      <div className="max-h-[520px] overflow-y-auto p-1 text-slate-900">{children}</div>
    </motion.div>
  );
}

function Module({ children }: { children: ReactNode }) {
  return <div className="space-y-5">{children}</div>;
}

export default function ReactCourse() {
  const modules: CourseModule[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Atom,
      accent: moduleStyles.overview.accent,
      ambientFrom: moduleStyles.overview.from,
      ambientTo: moduleStyles.overview.to,
      tutorContext:
        'React is a JavaScript library for building user interfaces from components. You describe what the UI should look like for a given state, and React updates the DOM. Data flows down through props; events flow up through callbacks.',
      content: (
        <Module>
          <SlideHeader
            icon={Atom}
            title="React, From First Principles"
            subtitle="A UI runtime built around components, state, and a one-way data flow."
            slide={1}
            total={8}
            accent={moduleStyles.overview.accent}
          />
          <motion.div {...slideIn} className="space-y-4">
            <p className="text-sm leading-relaxed text-gray-300">
              React is not a framework that owns your whole app. It is a library for one job: keeping the
              DOM in sync with your data. You write components that return markup, React calls them when
              state changes, and it works out the smallest set of DOM updates.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { title: 'Declarative', text: 'Describe the result for the current state instead of manually editing DOM nodes.' },
                { title: 'Composable', text: 'Small components combine into screens. Props are the wiring between them.' },
                { title: 'Predictable', text: 'State lives in components. Rendering is a pure function of props and state.' },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                  <p className="mb-1 text-xs font-bold text-white">{item.title}</p>
                  <p className="text-[11px] leading-relaxed text-gray-400">{item.text}</p>
                </div>
              ))}
            </div>
            <Callout title="The mental model">
              UI = f(state). When state changes, React re-runs your component and reconciles the result
              against the previous render. You almost never touch the DOM directly.
            </Callout>
            <p className="text-xs leading-relaxed text-gray-400">
              The rest of this course builds up the four tools you reach for most: useState for local
              state, useEffect for synchronizing with the outside world, context for sharing state
              without prop drilling, and transitions for keeping the UI responsive during heavy renders.
            </p>
          </motion.div>
        </Module>
      ),
    },
    {
      id: 'jsx',
      label: 'Components & JSX',
      icon: Boxes,
      accent: moduleStyles.jsx.accent,
      ambientFrom: moduleStyles.jsx.from,
      ambientTo: moduleStyles.jsx.to,
      tutorContext:
        'Components are functions that return JSX. JSX compiles to React.createElement calls. Props are read-only inputs. Components compose by nesting them and passing children or callbacks.',
      content: (
        <Module>
          <SlideHeader
            icon={Boxes}
            title="Components & JSX"
            subtitle="A component is a function that returns markup. Props are its inputs."
            slide={2}
            total={8}
            accent={moduleStyles.jsx.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                JSX looks like HTML but it is JavaScript. Each tag becomes a function call. Curly braces
                drop back into JavaScript for values, conditions, and lists.
              </p>
              <Code>{`type GreetingProps = { name: string };

const Greeting = ({ name }: GreetingProps) => (
  <h1 className="title">Hello, {name}!</h1>
);

export default function App() {
  return <Greeting name="Anmol" />;
}`}</Code>
              <Callout title="Props are read-only">
                A component must never mutate its props. If a child needs to change something, the parent
                passes a callback down and owns the state.
              </Callout>
            </div>
            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="mb-1.5 text-xs font-bold text-white">Lists need stable keys</p>
                <p className="mb-2 text-[11px] leading-relaxed text-gray-400">
                  Keys tell React which item is which across renders. Use an id from your data, not the
                  array index, when the list can reorder.
                </p>
                <Code>{`{items.map((item) => (
  <Row key={item.id} item={item} />
))}`}</Code>
              </div>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="mb-1.5 text-xs font-bold text-white">Composition beats configuration</p>
                <p className="text-[11px] leading-relaxed text-gray-400">
                  Pass content as children instead of adding a new boolean prop for every layout variant.
                  The component stays small and the caller keeps control.
                </p>
              </div>
            </div>
          </motion.div>
        </Module>
      ),
    },
    {
      id: 'state',
      label: 'State with useState',
      icon: ToggleLeft,
      accent: moduleStyles.state.accent,
      ambientFrom: moduleStyles.state.from,
      ambientTo: moduleStyles.state.to,
      tutorContext:
        'useState returns the current value and a setter. Calling the setter schedules a re-render. Update with a function when the next value depends on the previous one. State updates are batched.',
      content: (
        <Module>
          <SlideHeader
            icon={ToggleLeft}
            title="State with useState"
            subtitle="State is the memory of a component between renders."
            slide={3}
            total={8}
            accent={moduleStyles.state.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                Call useState at the top of a component. It returns the current value and a setter.
                Calling the setter schedules a render with the new value.
              </p>
              <Code>{`const [count, setCount] = useState(0);

<button onClick={() => setCount((c) => c + 1)}>
  Clicked {count} times
</button>`}</Code>
              <Callout title="Functional updates">
                If the next value depends on the previous one, pass a function. React batches updates,
                so reading stale state inside an event handler is a common bug.
              </Callout>
              <p className="text-[11px] leading-relaxed text-gray-400">
                Keep state as small as possible. If a value can be computed from props or other state,
                compute it during render instead of storing a copy.
              </p>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-300">Play with the lab:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>The counter shows a single useState value.</li>
                <li>The cart shows useState vs useReducer on the same feature.</li>
                <li>Notice how each setter triggers an isolated re-render.</li>
              </ul>
            </div>
          </motion.div>
          <DemoFrame title="useState / useReducer lab">
            <StateDemo />
          </DemoFrame>
        </Module>
      ),
    },
    {
      id: 'effect',
      label: 'Effects with useEffect',
      icon: RefreshCw,
      accent: moduleStyles.effect.accent,
      ambientFrom: moduleStyles.effect.from,
      ambientTo: moduleStyles.effect.to,
      tutorContext:
        'useEffect runs after render to synchronize with external systems such as timers, subscriptions, and the DOM. Return a cleanup function to undo the effect. The dependency array controls when it re-runs.',
      content: (
        <Module>
          <SlideHeader
            icon={RefreshCw}
            title="Effects with useEffect"
            subtitle="Synchronize with the world outside React, then clean up after yourself."
            slide={4}
            total={8}
            accent={moduleStyles.effect.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                Effects are for external systems: timers, subscriptions, network connections, and
                browser APIs. They run after the render is committed to the screen.
              </p>
              <Code>{`useEffect(() => {
  const id = window.setInterval(tick, 1000);
  return () => window.clearInterval(id);
}, []);`}</Code>
              <Callout title="Always clean up">
                The function you return runs before the next effect and on unmount. Skipping cleanup
                leaks timers, listeners, and subscriptions.
              </Callout>
              <p className="text-[11px] leading-relaxed text-gray-400">
                If an event handler can do the job, you probably do not need an effect. Effects are a
                last resort for synchronizing with something React does not control.
              </p>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-300">Try it in the lab:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Mount and unmount the tracker to watch cleanup run.</li>
                <li>Move the mouse and resize the window.</li>
                <li>Watch the listener count return to zero on unmount.</li>
              </ul>
            </div>
          </motion.div>
          <DemoFrame title="useEffect lab">
            <EffectDemo />
          </DemoFrame>
        </Module>
      ),
    },
    {
      id: 'context',
      label: 'Context',
      icon: Share2,
      accent: moduleStyles.context.accent,
      ambientFrom: moduleStyles.context.from,
      ambientTo: moduleStyles.context.to,
      tutorContext:
        'Context shares a value with a subtree without passing props at every level. Create it with createContext, provide it with a Provider, and read it with useContext. Context is for low-frequency shared data, not a replacement for local state.',
      content: (
        <Module>
          <SlideHeader
            icon={Share2}
            title="Shared State with Context"
            subtitle="Stop drilling the same prop through five layers of components."
            slide={5}
            total={8}
            accent={moduleStyles.context.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                Context makes a value available to an entire subtree. Any descendant can read it with
                useContext without the parent passing it down.
              </p>
              <Code>{`const ThemeContext = createContext('light');

<ThemeContext.Provider value="dark">
  <Toolbar />
</ThemeContext.Provider>

const theme = useContext(ThemeContext);`}</Code>
              <Callout title="Not a global store">
                Every consumer re-renders when the context value changes. Keep the value small and split
                contexts when unrelated parts of the tree should not update together.
              </Callout>
              <p className="text-[11px] leading-relaxed text-gray-400">
                Use context for theme, auth, locale, and similar app-wide values. Keep form state and
                hover state local to the component that owns them.
              </p>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-300">Try it in the lab:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Sign in and watch the header update instantly.</li>
                <li>Toggle the theme without touching a single prop.</li>
                <li>Inspect how nested components read the same value.</li>
              </ul>
            </div>
          </motion.div>
          <DemoFrame title="Context lab">
            <ContextDemo />
          </DemoFrame>
        </Module>
      ),
    },
    {
      id: 'transition',
      label: 'Transitions',
      icon: Zap,
      accent: moduleStyles.transition.accent,
      ambientFrom: moduleStyles.transition.from,
      ambientTo: moduleStyles.transition.to,
      tutorContext:
        'useTransition marks a state update as non-urgent so urgent updates such as typing stay responsive. React can interrupt and discard the low-priority render. Use isPending to show feedback.',
      content: (
        <Module>
          <SlideHeader
            icon={Zap}
            title="Concurrent Rendering with useTransition"
            subtitle="Keep typing smooth while React renders an expensive result in the background."
            slide={6}
            total={8}
            accent={moduleStyles.transition.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                Not every state update is equally urgent. Typing into an input should feel instant. The
                filtered list it produces can wait a few milliseconds.
              </p>
              <Code>{`const [isPending, startTransition] = useTransition();

const onChange = (event) => {
  setQuery(event.target.value);
  startTransition(() => setFiltered(event.target.value));
};`}</Code>
              <Callout title="Urgent vs non-urgent">
                Rule of thumb: update the input immediately, then wrap the expensive result in
                startTransition. React will keep the UI interactive while it re-renders.
              </Callout>
              <p className="text-[11px] leading-relaxed text-gray-400">
                isPending lets you dim the stale list or show a subtle spinner. Avoid using transitions
                for every update; they are a tool for genuinely expensive renders.
              </p>
            </div>
            <div className="space-y-2 text-[11px] leading-relaxed text-gray-400">
              <p className="font-semibold text-gray-300">Try it in the lab:</p>
              <ul className="list-disc space-y-1 pl-4">
                <li>Type quickly in the search field.</li>
                <li>Compare the blocked and transition-enabled modes.</li>
                <li>Watch the pending state while the list catches up.</li>
              </ul>
            </div>
          </motion.div>
          <DemoFrame title="useTransition lab">
            <TransitionDemo />
          </DemoFrame>
        </Module>
      ),
    },
    {
      id: 'performance',
      label: 'Performance',
      icon: Gauge,
      accent: moduleStyles.performance.accent,
      ambientFrom: moduleStyles.performance.from,
      ambientTo: moduleStyles.performance.to,
      tutorContext:
        'Measure before optimizing. Keep state local, avoid unnecessary effects, memoize expensive calculations with useMemo, and memoize components with memo when props are stable. React DevTools Profiler shows what actually re-renders.',
      content: (
        <Module>
          <SlideHeader
            icon={Gauge}
            title="Performance Without Guesswork"
            subtitle="Measure first. Most slow React apps are slow because of unnecessary renders or work in the wrong place."
            slide={7}
            total={8}
            accent={moduleStyles.performance.accent}
          />
          <motion.div {...slideIn} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <p className="text-sm leading-relaxed text-gray-300">
                React is fast by default. Before adding memoization, use the Profiler to find the
                component that actually costs time. Then fix the cause.
              </p>
              <Code>{`const visible = useMemo(
  () => items.filter((item) => matches(item, query)),
  [items, query]
);

const Row = memo(function Row({ item }) {
  return <li>{item.name}</li>;
});`}</Code>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="mb-1.5 text-xs font-bold text-white">Checklist</p>
                <ul className="list-disc space-y-1 pl-4 text-[11px] leading-relaxed text-gray-400">
                  <li>Move state down to the component that needs it.</li>
                  <li>Derive values during render instead of storing duplicates.</li>
                  <li>Pass stable keys, and stable callbacks when a memoized child depends on them.</li>
                  <li>Code-split routes and heavy widgets instead of shipping one large bundle.</li>
                </ul>
              </div>
            </div>
            <div className="space-y-3">
              <Callout title="Memo is not free">
                Every memo comparison has a cost. Use it where the profiler shows repeated expensive
                renders, not as a default wrapper around every component.
              </Callout>
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-3.5">
                <p className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-white">
                  <Code2 size={13} className="text-lime-400" /> A practical order
                </p>
                <ol className="list-decimal space-y-1 pl-4 text-[11px] leading-relaxed text-gray-400">
                  <li>Profile the interaction that feels slow.</li>
                  <li>Remove unnecessary state and effects.</li>
                  <li>Memoize the expensive calculation.</li>
                  <li>Memoize the component only if it still re-renders too often.</li>
                </ol>
              </div>
            </div>
          </motion.div>
        </Module>
      ),
    },
    {
      id: 'summary',
      label: 'Summary',
      icon: CheckCircle2,
      accent: moduleStyles.summary.accent,
      ambientFrom: moduleStyles.summary.from,
      ambientTo: moduleStyles.summary.to,
      tutorContext:
        'Recap: components and JSX, state with useState, effects with cleanup, context for shared values, transitions for urgent vs non-urgent updates, and profiling before memoization.',
      content: (
        <Module>
          <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease }}>
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-500/20 bg-gradient-to-br from-emerald-500/20 to-green-500/20">
                <CheckCircle2 size={36} className="text-emerald-400" />
              </div>
              <h2 className="mb-3 text-3xl font-bold tracking-tight text-white md:text-4xl">Course Complete</h2>
              <p className="mx-auto mb-8 max-w-md leading-relaxed text-gray-400">
                You now have the core model: render from state, synchronize with effects, share with
                context, and keep interactions responsive.
              </p>
              <div className="mx-auto grid max-w-lg grid-cols-1 gap-2 text-left md:grid-cols-2">
                {[
                  'UI = f(state)',
                  'Props down, events up',
                  'Functional state updates',
                  'Clean up every effect',
                  'Context is shared, not global',
                  'Transitions protect urgent input',
                  'Profile before memoizing',
                  'Keep state as small as possible',
                ].map((item, index) => (
                  <motion.div
                    key={item}
                    initial={{ opacity: 0, x: -12 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + index * 0.06 }}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.06] bg-white/[0.03] p-2.5"
                  >
                    <CheckCircle2 size={13} className="shrink-0 text-emerald-400" />
                    <span className="text-xs text-gray-300">{item}</span>
                  </motion.div>
                ))}
              </div>
              <p className="mt-8 text-xs italic text-gray-500">
                Ask the tutor for a recap, or restart any lab from the course contents.
              </p>
            </motion.div>
          </div>
        </Module>
      ),
    },
  ];

  const course: Course = {
    slug: 'react',
    title: 'React, From First Principles',
    shortTitle: 'React',
    description:
      'Build the mental model behind React: components, state, effects, context, transitions, and performance.',
    tags: ['React', 'Frontend', 'Hooks', 'Performance'],
    icon: Atom,
    modules,
  };

  return <CoursePlayer course={course} />;
}

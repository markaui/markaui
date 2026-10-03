"use client";

import * as React from "react";
import { History, Send, Sparkles, Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/components/ui/drawer";
import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useToast } from "@/hooks/use-toast";
import { useSavedSearches } from "./saved-searches-provider";
import { describeQuery } from "./save-search-dialog";

type Message = { role: "user" | "assistant"; content: string };

const WELCOME: Message = {
  role: "assistant",
  content:
    "Namaste 🙏 I'm Jane, your AI matchmaking concierge. Tell me about the partner you're dreaming of — city, community, profession — and I'll curate matches from our verified families.",
};

const SUGGESTIONS = [
  "Suggest matches for me",
  "What's included in the Gold plan?",
  "Is kundli matching available?",
  "How do you verify profiles?",
];

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 py-1.5" aria-label="Jane is typing">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-gold"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full gap-2.5", isUser ? "justify-end" : "justify-start")}>
      {!isUser && (
        <span
          aria-hidden="true"
          className="mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--gold))] font-serif text-[11px] font-bold text-primary-foreground shadow-sm"
        >
          M
        </span>
      )}
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed shadow-sm",
          isUser
            ? "rounded-br-md bg-primary text-primary-foreground"
            : "rounded-bl-md border border-border bg-card text-foreground"
        )}
      >
        {isUser ? (
          message.content
        ) : (
          // Render the **bold** markers the model tends to emit
          message.content.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**") ? (
              <strong key={i} className="font-semibold">
                {part.slice(2, -2)}
              </strong>
            ) : (
              part
            )
          )
        )}
      </div>
    </div>
  );
}

export interface ConciergeChatProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ConciergeChat({ open, onOpenChange }: ConciergeChatProps) {
  const { toast } = useToast();
  const savedSearches = useSavedSearches();

  // Proactive Jane: when the visitor already curates saved searches, greet
  // them with the freshest one instead of the generic welcome.
  const latestSaved = React.useMemo(() => {
    if (savedSearches.records.length === 0) return undefined;
    return [...savedSearches.records].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )[0];
  }, [savedSearches.records]);

  const welcome: Message = React.useMemo(() => {
    if (!latestSaved) return WELCOME;
    return {
      role: "assistant",
      content: `Namaste 🙏 Welcome back! I still have your search “**${latestSaved.name}**” (${describeQuery(
        latestSaved.query
      )}) — it's watching **${latestSaved.matches} live match${
        latestSaved.matches === 1 ? "" : "es"
      }** for you right now.${
        latestSaved.newSinceSaved > 0
          ? ` And **${latestSaved.newSinceSaved} new profile${
              latestSaved.newSinceSaved === 1 ? "" : "s"
            }** joined since you saved it — shall I introduce you?`
          : " Would you like me to walk you through the best of them, or refine what you're looking for?"
      }`,
    };
  }, [latestSaved]);

  const [messages, setMessages] = React.useState<Message[]>([welcome]);
  const [input, setInput] = React.useState("");
  const [sending, setSending] = React.useState(false);
  const [restoring, setRestoring] = React.useState(false);
  const [restored, setRestored] = React.useState(false);
  const [session, setSession] = React.useState("");
  const scrollRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    let id = localStorage.getItem("saptapadi-concierge-session");
    if (!id) {
      id = `s-${Math.random().toString(36).slice(2)}-${Date.now()}`;
      localStorage.setItem("saptapadi-concierge-session", id);
    }
    setSession(id);
  }, []);

  // Restore the persisted transcript (oldest first) when the drawer opens.
  React.useEffect(() => {
    if (!open || !session) return;
    let cancelled = false;
    (async () => {
      setRestoring(true);
      try {
        const res = await fetch(`/api/concierge?session=${encodeURIComponent(session)}`, {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as {
          messages: { role: "user" | "assistant"; content: string }[];
        };
        if (!cancelled && data.messages.length > 0) {
          setMessages(data.messages);
          setRestored(true);
        }
      } catch {
        // offline — start from the welcome message
      } finally {
        if (!cancelled) setRestoring(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [open, session]);

  // Upgrade the generic welcome to the personalized one once saved searches
  // finish loading — but never touch an existing/restored conversation.
  React.useEffect(() => {
    if (!savedSearches.ready || restored) return;
    setMessages((current) => {
      if (
        current.length === 1 &&
        current[0].content === WELCOME.content &&
        welcome.content !== WELCOME.content
      ) {
        return [welcome];
      }
      return current;
    });
  }, [savedSearches.ready, restored, welcome]);

  const clearConversation = async () => {
    try {
      await fetch(`/api/concierge?session=${encodeURIComponent(session)}`, {
        method: "DELETE",
      });
    } catch {
      // clear locally regardless
    }
    setMessages([welcome]);
    setRestored(false);
    toast({
      title: "Fresh start with Jane",
      description: "The conversation was cleared on this device and our servers.",
    });
  };

  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, sending]);

  const send = async (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || sending) return;
    const nextMessages: Message[] = [...messages, { role: "user", content: text }];
    setMessages(nextMessages);
    setInput("");
    setSending(true);
    try {
      const res = await fetch("/api/concierge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ session, messages: nextMessages.slice(-12) }),
      });
      const data = (await res.json()) as { reply?: string };
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            data.reply ??
            "I'm having a brief connection moment — please try again in a few seconds.",
        },
      ]);
    } catch {
      setMessages((m) => [
        ...m,
        {
          role: "assistant",
          content:
            "I'm having a brief connection moment — please try again in a few seconds.",
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <Drawer direction="right" open={open} onOpenChange={onOpenChange}>
      <DrawerContent
        aria-describedby={undefined}
        className="flex w-full flex-col gap-0 rounded-t-none border-l border-border p-0 sm:max-w-md"
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-border bg-[linear-gradient(135deg,var(--primary),color-mix(in_srgb,var(--primary)_70%,var(--gold)))] px-4 py-3.5 text-primary-foreground">
          <span className="relative flex size-10 items-center justify-center rounded-full bg-white/15 font-serif text-base font-bold shadow-inner">
            M
            <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-primary bg-success" />
          </span>
          <div className="min-w-0 flex-1">
            <DrawerTitle className="font-serif text-base font-bold leading-tight">
              Jane
            </DrawerTitle>
            <p className="flex items-center gap-1.5 text-xs text-primary-foreground/80">
              <Sparkles className="size-3" />
              {restoring ? "Restoring your conversation…" : "AI Matchmaking Concierge · online"}
            </p>
          </div>
          <IconButton
            variant="ghost"
            aria-label="Clear conversation and start fresh"
            onClick={() => void clearConversation()}
            disabled={restoring}
            className="text-primary-foreground/90 hover:bg-white/15 hover:text-primary-foreground"
          >
            <Trash2 className="size-4" />
          </IconButton>
          <IconButton
            variant="ghost"
            aria-label="Close chat"
            onClick={() => onOpenChange(false)}
            className="text-primary-foreground hover:bg-white/15 hover:text-primary-foreground"
          >
            <X className="size-4" />
          </IconButton>
        </div>

        {/* Messages */}
        <div
          ref={scrollRef}
          className="scrollbar-thin flex-1 space-y-3 overflow-y-auto bg-secondary/40 px-4 py-4"
          role="log"
          aria-live="polite"
          aria-label="Chat with Jane"
        >
          {restored && !restoring && messages.length > 0 && (
            <p className="flex items-center justify-center gap-1.5 pt-1 text-[11px] text-muted-foreground">
              <History className="size-3" />
              Earlier messages restored from your last visit
            </p>
          )}
          {messages.map((message, i) => (
            <MessageBubble key={i} message={message} />
          ))}
          {sending && (
            <div className="flex items-end gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-full bg-[linear-gradient(135deg,var(--primary),var(--gold))] font-serif text-[11px] font-bold text-primary-foreground"
              >
                M
              </span>
              <div className="rounded-2xl rounded-bl-md border border-border bg-card px-4 shadow-sm">
                <TypingDots />
              </div>
            </div>
          )}
        </div>

        {/* Suggestions */}
        {messages.length <= 2 && !sending && (
          <div className="flex flex-wrap gap-2 border-t border-border bg-background px-4 py-3">
            {latestSaved && (
              <button
                type="button"
                onClick={() => send(`Tell me about the matches from my saved search “${latestSaved.name}”.`)}
                className="flex cursor-pointer items-center gap-1.5 rounded-full border border-gold/60 bg-gold/15 px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-colors hover:bg-gold/25"
              >
                <Sparkles className="size-3 text-gold" aria-hidden="true" />
                Review “{latestSaved.name}” ({latestSaved.matches})
              </button>
            )}
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => send(suggestion)}
                className="cursor-pointer rounded-full border border-gold/40 bg-gold/10 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-gold/20"
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        {/* Composer */}
        <form
          className="flex items-center gap-2 border-t border-border bg-background p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Jane about matches, plans, kundli…"
            aria-label="Message to Jane"
            disabled={sending}
            className="flex-1 rounded-full"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Send message"
            disabled={sending || !input.trim()}
            className="size-10 shrink-0 rounded-full"
          >
            {sending ? <Spinner className="size-4" /> : <Send className="size-4" />}
          </Button>
        </form>
      </DrawerContent>
    </Drawer>
  );
}

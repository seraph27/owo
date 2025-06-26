import * as React from "react";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Props {
  username: string;
}

interface LastSolved {
  name: string;
  rating?: number;
  tags: string[];
  contestId: number;
  index: string;
  submissionId: number;
}

export function CodeforcesLastSolvedWidget({ username }: Props) {
  const [lastSolved, setLastSolved] = React.useState<LastSolved | null>(null);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    if (!username) {
      setLastSolved(null);
      return;
    }
    const fetchLastSolved = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `https://codeforces.com/api/user.status?handle=${username}&from=1&count=100`
        );
        const data = await res.json();
        if (data.status !== "OK") {
          setLastSolved(null);
          return;
        }
        const sub = data.result.find((s: any) => s.verdict === "OK");
        if (!sub) {
          setLastSolved(null);
          return;
        }
        setLastSolved({
          name: sub.problem.name,
          rating: sub.problem.rating,
          tags: sub.problem.tags ?? [],
          contestId: sub.problem.contestId,
          index: sub.problem.index,
          submissionId: sub.id,
        });
      } catch {
        setLastSolved(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLastSolved();
  }, [username]);

  const problemLink = lastSolved
    ? `https://codeforces.com/problemset/problem/${lastSolved.contestId}/${lastSolved.index}`
    : "#";
  const submissionLink = lastSolved
    ? `https://codeforces.com/contest/${lastSolved.contestId}/submission/${lastSolved.submissionId}`
    : "#";

  return (
    <Card className="w-[300px] h-full bg-secondary transition-all duration-300 hover:border-primary hover:shadow-md">
      <CardHeader>
        <CardTitle className="text-base">
          Last Solved<br /><br />
          {lastSolved ? (
            <a
              href={problemLink}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
            >
              {lastSolved.index}. {lastSolved.name} (Round {lastSolved.contestId}) 
            </a>
          ) : (
            "N/A"
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-sm">
        {loading ? (
          <div className="flex items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : lastSolved ? (
          <>
            {/* Rating */}
            <p>
              <span className="font-medium">Difficulty: </span>
              {lastSolved.rating != null ? lastSolved.rating : "N/A"}
            </p>

            {/* Tags as Badges */}
            {lastSolved.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {lastSolved.tags.map((tag) => (
                  <Badge key={tag} style={{
                  backgroundColor: "#4a5568", // Tailwind gray-700
                  color: "#fff",
                  border: "none",
                }} className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            {/* View Submission link */}
            <p>
              <a
                href={submissionLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                View Submission
              </a>
            </p>
          </>
        ) : (
          <p className="text-center text-sm italic text-muted-foreground">
            Loading
          </p>
        )}
      </CardContent>
    </Card>
  );
}

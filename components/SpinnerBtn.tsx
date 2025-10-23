import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

export function () {
  return (
    <div className="flex flex-col items-center gap-4">
      <Button disabled size="sm">
        <Spinner />
        Fetching Token Meta Data
      </Button>
      <Button variant="outline" disabled size="sm">
        <Spinner />
        Processing Data..
      </Button>
      <Button variant="secondary" disabled size="sm">
        <Spinner />
        Loading Information..
      </Button>
    </div>
  );
}

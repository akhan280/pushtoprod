import { Input } from "./ui/input";

export function SelfHostedAI() {
  return (
    <div className="flex flex-col">
      <Input placeholder="public key"></Input>
      <Input placeholder="private key" type="password"></Input>
    </div>
  );
}

export function ManagedAI() {
  return (
    <div className="flex flex-col">
      <div>$2.99mo</div>
      <div>(no limit)</div>
    </div>
  );
}

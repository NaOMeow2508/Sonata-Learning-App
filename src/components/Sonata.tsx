export default function Sonata({small=false}:{small?:boolean}) {
  return <img className={small?'sonata-character small':'sonata-character'} src="/branding/sonata-adventure.png" alt="Sonata"/>;
}

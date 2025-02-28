import { Button } from "./ui/button";

interface DeployButtonProps {
  organizationId: string;
}

export default function DeployButton({ organizationId }: DeployButtonProps) {
  const deploy = async (organizationId: string) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SEOFARM_API_URL}/deploy/${organizationId}`, {
        method: 'GET',
        mode: 'cors',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      console.log('deploy :', data);
    } catch (error) {
      if (error instanceof Error) {
        console.error('Error fetching data:', error.message);
      } else {
        console.error('Error fetching data:', error);
      }
      return null;
    }
  }
  return (
    <>
      <Button className="flex items-center p-5 text-lg" size={"sm"} onClick={() => deploy(organizationId)}>
        <span>Deploy All</span>
      </Button>
    </>
  );
}

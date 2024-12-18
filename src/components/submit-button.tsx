import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

type SubmitButtonProps = {
	isSubmitting: boolean;
	label: string;
};

const SubmitButton: React.FC<SubmitButtonProps> = ({ isSubmitting, label }) => {
	return (
		<Button disabled={isSubmitting} size="sm" type="submit">
			{isSubmitting ? <Loader2 className="animate-spin h-4 w-4" /> : label}
		</Button>
	);
};

export default SubmitButton;

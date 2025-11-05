import { VStack } from "../Components/components";


export default function NewsSection() {
    return (
        <VStack className="mt-40 mb-4 mx-3 md:mx-6 w-full max-w-4xl bg-foreground rounded-[30px]" spacing={45}>
            <p className="text-textColor">
                News
            </p>
        </VStack>
    );
}
import { VStack } from "../Components/components";


export default function NewsSection() {
    return (
        <main className="flex items-top justify-center min-h-screen bg-background">
            <VStack className="mt-40 mb-6 mx-6 w-full max-w-4xl" spacing={45}>
                <p>
                    news
                </p>
            </VStack>
        </main>
    );
}
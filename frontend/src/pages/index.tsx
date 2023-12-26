import UserInterface from "@/components/UserInterface";

export default function Home() {
	return (
		<div className="flex flex-wrap items-start justify-center min-h-screen bg-gray-100">
			<div className="m-4">
				<UserInterface backendName="rust" />
			</div>
		</div>
	);
}

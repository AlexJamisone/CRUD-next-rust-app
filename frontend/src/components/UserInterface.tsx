/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import axios from "axios";
import CardComponent from "./CardComponent";

interface User {
	id: number;
	name: string;
	email: string;
}

interface UserInterfacProps {
	backendName: string;
}

const UserInterface: React.FC<UserInterfacProps> = ({ backendName }) => {
	const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
	const [users, setUsers] = useState<User[]>([]);
	const [newUser, setNewUser] = useState({ name: "", email: "" });
	const [updateUser, setUpdateUser] = useState({
		id: "",
		name: "",
		email: "",
	});
	const backgoundColos: { [key: string]: string } = {
		rust: "bg-orange-500",
	};
	const buttonColors: { [key: string]: string } = {
		rust: "bg-orange-700 hover:bg-orange-600",
	};

	const bgColor =
		backgoundColos[backendName as keyof typeof backgoundColos] ||
		"bg-gray-200";
	const btnColor =
		buttonColors[backendName as keyof typeof buttonColors] ||
		"bg-gray-500 hover:bg-gray-600";
	useEffect(() => {
		const fetch = async () => {
			try {
				const response = await axios.get(
					`${apiUrl}/api/${backendName}/users`
				);
				setUsers(response.data.reverse());
			} catch (error) {
				console.log("Error fetching data", error);
			}
		};
		fetch();
	}, [backendName, apiUrl]);
	const createUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${apiUrl}/api/${backendName}/users`,
				newUser
			);
			setUsers([response.data, ...users]);
			setNewUser({ email: "", name: "" });
		} catch (error) {
			console.log(error);
		}
	};
	const handlUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		try {
			await axios.put(
				`${apiUrl}/api/${backendName}/users/${updateUser.id}`,
				{
					name: updateUser.name,
					email: updateUser.email,
				}
			);
			setUpdateUser({
				email: "",
				id: "",
				name: "",
			});
			setUsers(
				users.map((user) => {
					if (user.id === parseInt(updateUser.id)) {
						return {
							...user,
							name: updateUser.name,
							email: updateUser.email,
						};
					}
					return user;
				})
			);
		} catch (error) {
			console.log("Error updating user", error);
		}
	};

	const deleteUser = async (id: number) => {
		try {
			await axios.delete(`${apiUrl}/api/${backendName}/users/${id}`);
            setUsers(users.filter((user) => user.id !== id))
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div
			className={`user-interface ${bgColor} ${backendName} w-full max-w-md p-4 rounded shadow my-4`}
		>
			<img
				src={`/${backendName}logo.svg`}
				alt={`${backendName} Logo`}
				className="w-20 h-20 mb-6 mx-auto"
			/>
            <h2 className="text-xl font-bold text-center text-white mb-6">{`${backendName.charAt(0).toUpperCase() + backendName.slice(1)} Backend`}</h2>
			<form
				onSubmit={createUser}
				className="mb-6 p-4 bg-blue-100 rounded shadow"
			>
				<input
					placeholder="Name"
					value={newUser.name}
					onChange={(e) =>
						setNewUser({ ...newUser, name: e.target.value })
					}
					className="mb-2 w-full p-2 border-gray-300 rounded focus:outline-blue-400"
				/>
				<input
					placeholder="Email"
					value={newUser.email}
					onChange={(e) =>
						setNewUser({ ...newUser, email: e.target.value })
					}
					className="mb-2 w-full p-2 border-gray-300 rounded focus:outline-blue-400"
				/>
				<button
					type="submit"
					className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-all duration-300"
				>
					Add user
				</button>
			</form>
			<form
				onSubmit={handlUpdateUser}
				className="mb-6 p-4 bg-blue-100 rounded shadow"
			>
				<input
					placeholder="User id"
					value={updateUser.id}
					onChange={(e) =>
						setUpdateUser({ ...updateUser, id: e.target.value })
					}
					className="mb-2 w-full p-2 border-gray-300 rounded focus:outline-blue-400"
				/>
				<input
					placeholder="new Name"
					value={updateUser.name}
					onChange={(e) =>
						setUpdateUser({ ...updateUser, name: e.target.value })
					}
					className="mb-2 w-full p-2 border-gray-300 rounded focus:outline-blue-400"
				/>
				<input
					placeholder="new Email"
					value={updateUser.email}
					onChange={(e) =>
						setUpdateUser({ ...updateUser, email: e.target.value })
					}
					className="mb-2 w-full p-2 border-gray-300 rounded focus:outline-blue-400"
				/>
				<button
					type="submit"
					className="w-full p-2 text-white bg-green-500 rounded hover:bg-green-600 transition-all duration-300"
				>
					Update user
				</button>
			</form>
			<div className="space-y-4">
				{users.map((user) => (
					<div
						key={user.id}
						className="flex items-center justify-between bg-white p-4 rounded-lg shadow"
					>
						<CardComponent card={user} />
						<button
							onClick={() => deleteUser(user.id)}
							className={`${btnColor} text-white py-2 rounded px-4`}
						>
							Delet user
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default UserInterface;

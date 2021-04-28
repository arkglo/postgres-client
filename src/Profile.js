import React from 'react';
import './App.css';

function Profile({auth}) {
	return (
		<div className="App">
			<header className="App-header">
				<p>
					You are logged in {auth && auth.firstName ? auth.firstName : "Unknown"}
				</p>
				<a className="App-link" href={"/auth/logout"}>
					Logout
				</a>
			</header>
		</div>
	);
}

export default Profile;
export const fetchUserData = async () => {
    // This function fetches user data from the server.
    const response = await fetch('https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json');
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    const userData = await response.json();
    return userData as UserData[];
}

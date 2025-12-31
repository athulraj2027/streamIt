async function GetIpAddress() {
  try {
    const ip = await fetch("https://api.ipify.org");
    console.log("Ip address fetched : ", ip);
    return ip;
  } catch (error) {
    console.log("Error in fetching ip address : ", error);
  }
}

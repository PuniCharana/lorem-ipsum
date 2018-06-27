class Utils {

    // Note : first parma is firebase user
    generateUserName = (userA, userB) => {
        return userA.uid > userB.id ? userA.displayName + userB.name : userB.name + userA.displayName
    }

    generateUserId = (userAid, userBid) => {
        return userAid > userBid ? userAid + userBid : userBid + userAid;
    }

    getOtherUser = (myName, fullName) => {
        var index = fullName.indexOf(myName);
        return index == 0 ? fullName.slice(myName.length, fullName.length) : fullName.slice(0, index)
    }

    getOtherUserId = (myId, fullId) => {
        var index = fullId.indexOf(myId);
        return index == 0 ? fullId.slice(myId.length, fullId.length) : fullId.slice(0, index)
    }

    getInitials = (fulltext) => {
        var res = fulltext.split(" ");
        if (res.length > 1) {
            return res[0].slice(0, 1) + res[1].slice(0, 1).toUpperCase();
        } else {
            console.log(fulltext)
            var shortText = fulltext.slice(0, 2);
            console.log(shortText)
            return shortText.toUpperCase();
        }
    }
}
const utils = new Utils();
export default utils;

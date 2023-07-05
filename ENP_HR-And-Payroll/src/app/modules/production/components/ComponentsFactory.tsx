const getTimeLeft = (reviewDate: any) => {

    const currentDate = new Date();
    const targetDate = new Date(reviewDate);
    targetDate.setHours(0, 0, 0, 0); // Set targetDate to the start of the day

    if (currentDate > targetDate) {
        return "Expired";
    }

    const timeDifference = targetDate.getTime() - currentDate.getTime();
    const daysLeft = Math.ceil(timeDifference / (1000 * 60 * 60 * 24)); // Calculate days left

    const monthsLeft = Math.floor(daysLeft / 30); // Calculate months left

    if (monthsLeft > 0) {
        return `${monthsLeft} ${monthsLeft === 1 ? "month" : "months"}`;
    } else {
        return `${daysLeft} ${daysLeft === 1 ? "day" : "days"}`;
    }
}



export { getTimeLeft }
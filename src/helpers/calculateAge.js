export const calculateAge = (dob) => {
    const diffMs = Date.now() - dob;
    const ageDt = new Date(diffMs);
    return Math.abs(ageDt.getUTCFullYear() - 1970);
};

export async function get() {
    return await this.find({}).sort({ "data.points": -1 });
}

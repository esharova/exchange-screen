export function createValidator(rules) {
    return (data, limits) => {
        let error;
        rules.forEach((rule) => {
            error = !error ? rule(data, limits) : error;
        });
        return error;
    };
}

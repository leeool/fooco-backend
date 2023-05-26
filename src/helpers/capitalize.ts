const Cap = <T>(str: unknown): T => {
  if (str instanceof Array) {
    return str.map((str) => str.charAt(0).toUpperCase() + str.slice(1)) as T
  } else if (typeof str === "string") {
    return (str.charAt(0).toUpperCase() + str.slice(1)) as T
  } else {
    return str as T
  }
}

export default Cap

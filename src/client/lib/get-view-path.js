export default function (route) {
  const path = route.fullPath.split('/').filter(item => item)
  return {
    path,
    reversedPath: path.reverse(),
  }
}

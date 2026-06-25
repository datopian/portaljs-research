export const getServerSideProps = () => ({
  redirect: {
    destination: '/?utm_source=demo_video&utm_medium=video&utm_campaign=video',
    permanent: false,
  },
})

export default function Welcome() {
  return null
}

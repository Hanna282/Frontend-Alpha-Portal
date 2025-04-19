import { AuthProvider } from "./contexts/AuthContext"
import { ClientsProvider } from "./contexts/ClientsContext"
import { MembersProvider } from "./contexts/MembersContext"
import { ProjectsProvider } from "./contexts/ProjectsContext"

const Providers = ({children}) => {
    return (
      <>
      <AuthProvider>
        <MembersProvider>
          <ClientsProvider>
            <ProjectsProvider>
            {children}
            </ProjectsProvider>
          </ClientsProvider>
        </MembersProvider>
      </AuthProvider>
      </>
    )
  }
  
  export default Providers
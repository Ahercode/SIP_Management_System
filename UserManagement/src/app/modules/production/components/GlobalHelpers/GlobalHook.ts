import {useState} from 'react'

export const useGlobalHook = () => {
    const [state, setState] = useState({
      user: null,
      userRoles: null,
      roles: null,
      applications: null,
    });

    const actions = {
      // setUser: (user: any) => {
      //   setState({ user });
      // },
      // setUserRoles: (userRoles: any) => {
      //   setState({ userRoles });
      // },
      // setRoles: (roles: any) => {
      //   setState({ roles });
      // },
      // setApplications: (applications: any) => {
      //   setState({ applications });
      // },
      // fetchUser: async (id: string) => {
      //   const response = await fetchDocument(`Users/${id}`);
      //   actions.setUser(response.data);
      // },
      //
      // fetchUserRoles: async () => {
      //   const response = await fetchUserRoles();
      //   actions.setUserRoles(response.data);
      // },
      // fetchRoles: async () => {
      //   const response = await fetchRoles();
      //   actions.setRoles(response.data);
      // },
      // fetchApplications: async () => {
      //   const response = await fetchApplications();
      //   actions.setApplications(response.data);
      // },
      //
      // updateUser: async (data: any) => {
      //   const response = await updateUser(data);
      //   actions.setUser(response.data);
      // },
      // updateRole: async (data: any) => {
      //   const response = await updateRole(data);
      //   actions.setRoles(response.data);
      // },
      // updateApplication: async (data: any) => {
      //   const response = await updateApplication(data);
      //   actions.setApplications(response.data);
      // },
    };

    return { state, actions  };
  }
export interface Icon {
    id: string;
    Name: string;
    IconSet: {
      id: string;
      UserName: string;
      Name: string;
    };
    data: string;
    STags: string;
    tags:string[];
    HashedFullFilePath: string;
}

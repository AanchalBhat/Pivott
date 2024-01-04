import { Grid, Skeleton } from "@mui/material";

const SkeletonBlocks = () => {
    const Block = () => {
        return (
            <Grid item xs={6} md={3}>
                <Skeleton variant="rectangular" width={"100%"} height={"100%"} />
            </Grid>
        )
    }
    return (
        <>
            <Block />
        </>
    )
}

export default SkeletonBlocks;
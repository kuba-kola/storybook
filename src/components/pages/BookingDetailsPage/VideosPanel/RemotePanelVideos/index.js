import React from "react";
import {
  shape, arrayOf, string,
} from "prop-types";

import Block from "components/common/Block";
import RemotePanelVideosItem from "./RemotePanelVideosItem";

import "./styles.scss";

const RemotePanelVideos = ({ title, videos }) => (
  <Block title={title} className="conciergeBookingDetailsPanel conciergeBookingDetailsPanelVideos">
    {videos && videos.length
      ? videos.map((item) => <RemotePanelVideosItem item={item} key={item.videoURL} />)
      : <div className="RemotePanelVideosItem">No available videos</div>}
  </Block>
);

RemotePanelVideos.propTypes = {
  title: string,
  videos: arrayOf(shape({
    videoURL: string,
    date: string,
  })),
};

RemotePanelVideos.defaultProps = {
  title: "Videos",
  videos: [],
};

export default RemotePanelVideos;

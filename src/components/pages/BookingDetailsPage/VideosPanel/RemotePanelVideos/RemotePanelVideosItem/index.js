import React from "react";
import { shape, string } from "prop-types";

import VideoPlayer from "components/common/VideoPlayer";

import { getAppointmentFormattedDate } from "shared/utils/datetime";
import { parseName } from "./utils";

const RemotePanelVideosItem = ({ item }) => (
  <div className="RemotePanelVideosItem">
    <div className="RemotePanelVideosItemPlayer">
      <VideoPlayer
        autoplay={false}
        controls
        sources={[
          {
            src: item.videoURL,
            type: "video/mp4",
          },
        ]}
      />
    </div>
    <div
      className="RemotePanelVideosItemDescription"
    >
      <p>{parseName(item.videoURL)}</p>
      <p className="videosDate">{getAppointmentFormattedDate(item.date)}</p>
    </div>
  </div>
);

RemotePanelVideosItem.propTypes = {
  item: shape({
    date: string,
    videoURL: string,
  }).isRequired,
};

export default RemotePanelVideosItem;

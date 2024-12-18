"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import "react-quill-new/dist/quill.bubble.css";

type Props = {
	value: string;
};

const Preview = (props: Props) => {
	const ReactQuill = useMemo(
		() =>
			dynamic(() => import("react-quill-new"), {
				ssr: false,
			}),
		[],
	);
	return <ReactQuill value={props.value} theme="bubble" />;
};

export default Preview;
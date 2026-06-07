/**
 * 雪花 ID 生成器（64 位长整数）
 *
 * 结构: 1位(保留) + 41位时间戳 + 10位机器ID + 12位序列号
 *
 *  0 - 0000000000 0000000000 0000000000 0000000000 0 - 0000000000 - 000000000000
 *  保留   41位时间戳(ms, 自纪元起可用69年)         10位机器    12位序列(每ms 4096个)
 */

const EPOCH = 1700000000000n; // 自定义纪元 2023-11-14 22:13:20 UTC
const MACHINE_ID = 1n; // 单机部署固定为 1
const MAX_SEQUENCE = 4095n;

let sequence = 0n;
let lastTimestamp = -1n;

export function generateSnowflakeId(): string {
  let timestamp = BigInt(Date.now());

  if (timestamp === lastTimestamp) {
    sequence = (sequence + 1n) & MAX_SEQUENCE;
    if (sequence === 0n) {
      // 当前毫秒序列号耗尽，等待下一毫秒
      while (BigInt(Date.now()) <= lastTimestamp) {
        // spin
      }
      timestamp = BigInt(Date.now());
    }
  } else {
    sequence = 0n;
    lastTimestamp = timestamp;
  }

  const id =
    ((timestamp - EPOCH) << 22n) | (MACHINE_ID << 12n) | sequence;

  return id.toString();
}
